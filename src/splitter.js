import { FFmpeg } from '@ffmpeg/ffmpeg';

const MB = 1_000_000;
const CORE_BASE = `${import.meta.env.BASE_URL}vendor/ffmpeg/`;

export function formatSize(bytes) {
  if (bytes < MB) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${(bytes / MB).toFixed(bytes >= 10 * MB ? 1 : 2)} MB`;
}

export function sizeLimitBytes(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || !Number.isSafeInteger(number * MB)) {
    throw new Error('Enter a positive whole number of MB.');
  }
  return number * MB;
}

function outputNames(nodes) {
  return nodes
    .filter(({ name, isDir }) => !isDir && /^part_\d+\.mp4$/.test(name))
    .map(({ name }) => name)
    .sort((a, b) => a.localeCompare(b));
}

function command(inputPath, seconds, mode, maxBytes) {
  const args = [
    '-hide_banner', '-i', inputPath,
    '-map', '0:v:0', '-map', '0:a:0?', '-sn', '-dn',
  ];

  if (mode === 'copy') {
    args.push('-c', 'copy');
  } else {
    const audioRate = 96_000;
    const totalRate = Math.floor((maxBytes * 8 * 0.72) / seconds);
    const videoRate = Math.max(100_000, totalRate - audioRate);
    args.push(
      '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
      '-b:v', String(videoRate), '-maxrate', String(videoRate),
      '-bufsize', String(videoRate),
      '-force_key_frames', `expr:gte(t,n_forced*${seconds})`,
      '-c:a', 'aac', '-b:a', String(audioRate),
    );
  }

  args.push(
    '-f', 'segment', '-segment_time', String(seconds),
    '-segment_format', 'mp4', '-segment_format_options', 'movflags=+faststart',
    '-reset_timestamps', '1', '/part_%04d.mp4',
  );
  return args;
}

async function clearOutputs(ffmpeg) {
  const names = outputNames(await ffmpeg.listDir('/'));
  await Promise.all(names.map((name) => ffmpeg.deleteFile(`/${name}`)));
}

async function readParts(ffmpeg, file, maxBytes) {
  const names = outputNames(await ffmpeg.listDir('/'));
  if (names.length === 0) throw new Error('errorNoParts');

  const parts = [];
  let largest = 0;
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'video';

  try {
    for (let index = 0; index < names.length; index += 1) {
      const data = await ffmpeg.readFile(`/${names[index]}`);
      const size = data.byteLength;
      largest = Math.max(largest, size);
      if (size === 0 || size > maxBytes) {
        revokeParts(parts);
        return { parts: [], largest };
      }
      const blob = new Blob([data], { type: 'video/mp4' });
      parts.push({
        name: `${baseName}_part_${String(index + 1).padStart(3, '0')}.mp4`,
        size,
        url: URL.createObjectURL(blob),
      });
    }

    return { parts, largest };
  } catch (error) {
    revokeParts(parts);
    throw error;
  }
}

function revokeParts(parts) {
  for (const part of parts) URL.revokeObjectURL(part.url);
}

export async function splitVideo(file, maxBytes, duration, { onStatus, onEngine, isCancelled }) {
  if (file.size <= maxBytes) {
    return [{ name: file.name, size: file.size, url: URL.createObjectURL(file) }];
  }

  const ffmpeg = new FFmpeg();
  onEngine(ffmpeg);
  let lastLog = '';
  ffmpeg.on('log', ({ message }) => { lastLog = message; });

  try {
    onStatus('statusLoadingTitle', 'statusLoadingDetail', 'modePreparing');
    await ffmpeg.load({
      coreURL: new URL(`${CORE_BASE}ffmpeg-core.js`, location.href).href,
      wasmURL: new URL(`${CORE_BASE}ffmpeg-core.wasm`, location.href).href,
    });
    if (isCancelled()) throw new Error('Cancelled');

    await ffmpeg.createDir('/source');
    const mounted = await ffmpeg.mount('WORKERFS', { files: [file] }, '/source');
    if (!mounted) throw new Error('errorMount');
    const inputPath = `/source/${file.name}`;

    const estimated = Math.max(0.25, Math.min(duration, (duration * maxBytes * 0.78) / file.size));
    let seconds = Number(estimated.toFixed(3));
    let previousLargest = null;

    for (const mode of ['copy', 'encode']) {
      const maxAttempts = mode === 'copy' ? 5 : 7;
      if (mode === 'encode') seconds = Number(estimated.toFixed(3));

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        if (isCancelled()) throw new Error('Cancelled');
        await clearOutputs(ffmpeg);
        onStatus(
          mode === 'copy' ? 'statusCopyTitle' : 'statusEncodeTitle',
          mode === 'copy' ? 'statusCopyDetail' : 'statusEncodeDetail',
          mode === 'copy' ? 'modeCopy' : 'modeEncode',
          { attempt, maxAttempts },
        );

        const exitCode = await ffmpeg.exec(command(inputPath, seconds, mode, maxBytes));
        if (isCancelled()) throw new Error('Cancelled');
        if (exitCode !== 0) {
          if (mode === 'copy') break;
          console.error('FFmpeg processing failed:', lastLog);
          throw new Error('errorProcessing');
        }

        const result = await readParts(ffmpeg, file, maxBytes);
        if (result.parts.length > 0) {
          await clearOutputs(ffmpeg);
          return result.parts;
        }

        if (mode === 'copy' && result.largest === previousLargest) break;
        previousLargest = result.largest;
        const ratio = result.largest > 0 ? (maxBytes / result.largest) * 0.72 : 0.5;
        seconds = Number(Math.max(0.1, seconds * Math.min(0.75, Math.max(0.2, ratio))).toFixed(3));
      }
    }

    throw new Error('errorTooLarge');
  } finally {
    ffmpeg.terminate();
    onEngine(null);
  }
}
