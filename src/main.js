import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/noto-sans-thai/thai-400.css';
import '@fontsource/noto-sans-thai/thai-600.css';
import '@fontsource/noto-sans-thai/thai-700.css';
import './styles.css';
import { formatSize, sizeLimitBytes, splitVideo } from './splitter.js';
import { getLanguage, setLanguage, t } from './i18n.js';

const $ = (id) => document.getElementById(id);
const fileInput = $('video-file');
const dropZone = $('drop-zone');
const fileCard = $('file-card');
const fileName = $('file-name');
const fileMeta = $('file-meta');
const sizeInput = $('size-limit');
const splitButton = $('split-button');
const setupNote = $('setup-note');
const progressSection = $('progress-section');
const resultsSection = $('results-section');
const errorMessage = $('error-message');

let selectedFile = null;
let duration = 0;
let parts = [];
let busy = false;
let cancelled = false;
let engine = null;
let selectionToken = 0;
let errorKey = null;
let currentStatus = { title: 'progressPreparing', detail: 'progressPreparingDetail', mode: '', params: {} };

function renderStatus() {
  $('progress-title').textContent = t(currentStatus.title, currentStatus.params);
  $('progress-detail').textContent = t(currentStatus.detail, currentStatus.params);
  $('process-mode').textContent = currentStatus.mode ? t(currentStatus.mode) : '';
}

function setStatus(title, detail, mode = '', params = {}) {
  currentStatus = { title, detail, mode, params };
  renderStatus();
}

function renderFileMeta() {
  if (!selectedFile) return;
  fileMeta.textContent = duration > 0
    ? `${formatSize(selectedFile.size)} · ${formatDuration(duration)}`
    : `${formatSize(selectedFile.size)} · ${t('fileReading')}`;
}

function applyLanguage() {
  const language = getLanguage();
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelector('meta[name="description"]').content = t('pageDescription');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderFileMeta();
  renderStatus();
  if (parts.length > 0) renderResults();
  if (errorKey) errorMessage.textContent = t(errorKey);
  updateReadyState();
}

function hideError() {
  errorKey = null;
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

function showError(key) {
  errorKey = key;
  errorMessage.textContent = t(key);
  errorMessage.classList.remove('hidden');
}

function clearResults() {
  for (const part of parts) URL.revokeObjectURL(part.url);
  parts = [];
  $('results-list').replaceChildren();
  resultsSection.classList.add('hidden');
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function readDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(url);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const value = video.duration;
      cleanup();
      Number.isFinite(value) && value > 0
        ? resolve(value)
        : reject(new Error('errorDuration'));
    };
    video.onerror = () => {
      cleanup();
      reject(new Error('errorRead'));
    };
    video.src = url;
  });
}

function updateReadyState() {
  if (busy) return;
  let maxBytes;
  try {
    maxBytes = sizeLimitBytes(sizeInput.value);
  } catch {
    splitButton.disabled = true;
    setupNote.textContent = t('noteLimit');
    return;
  }
  splitButton.disabled = !selectedFile || duration <= 0;
  if (!selectedFile) {
    setupNote.textContent = t('noteChoose');
  } else if (duration <= 0) {
    setupNote.textContent = t('noteReading');
  } else if (selectedFile.size <= maxBytes) {
    setupNote.textContent = t('noteFits');
  } else {
    const minimum = Math.ceil(selectedFile.size / maxBytes);
    setupNote.textContent = t('noteEstimate', { count: minimum, duration: formatDuration(duration) });
  }
}

async function selectFile(file) {
  if (busy || !file) return;
  const token = ++selectionToken;
  clearResults();
  hideError();
  selectedFile = null;
  duration = 0;
  if (!file.type.startsWith('video/') && !/\.(mp4|mov|m4v|webm|mkv)$/i.test(file.name)) {
    showError('errorFileType');
    fileCard.classList.add('hidden');
    dropZone.classList.remove('has-file');
    updateReadyState();
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  renderFileMeta();
  fileCard.classList.remove('hidden');
  dropZone.classList.add('has-file');
  updateReadyState();

  try {
    const value = await readDuration(file);
    if (token !== selectionToken) return;
    duration = value;
    renderFileMeta();
    updateReadyState();
  } catch (error) {
    if (token !== selectionToken) return;
    selectedFile = null;
    duration = 0;
    fileCard.classList.add('hidden');
    dropZone.classList.remove('has-file');
    showError(error.message);
    updateReadyState();
  }
}

function renderResults() {
  const list = $('results-list');
  list.replaceChildren();
  parts.forEach((part, index) => {
    const row = document.createElement('div');
    row.className = 'result-row';

    const number = document.createElement('span');
    number.className = 'result-number';
    number.textContent = String(index + 1).padStart(2, '0');

    const details = document.createElement('div');
    details.className = 'result-details';
    const name = document.createElement('strong');
    name.textContent = part.name;
    const size = document.createElement('span');
    size.textContent = formatSize(part.size);
    details.append(name, size);

    const download = document.createElement('a');
    download.className = 'download-button';
    download.href = part.url;
    download.download = part.name;
    download.textContent = t('download');
    download.setAttribute('aria-label', t('downloadFile', { name: part.name }));

    row.append(number, details, download);
    list.append(row);
  });
  $('results-count').textContent = t('partsReady', { count: parts.length });
  resultsSection.classList.remove('hidden');
}

fileInput.addEventListener('change', () => selectFile(fileInput.files?.[0]));
document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    applyLanguage();
  });
});
sizeInput.addEventListener('input', () => {
  hideError();
  clearResults();
  updateReadyState();
});
$('remove-file').addEventListener('click', () => {
  if (busy) return;
  selectionToken += 1;
  fileInput.value = '';
  selectedFile = null;
  duration = 0;
  fileCard.classList.add('hidden');
  dropZone.classList.remove('has-file');
  clearResults();
  hideError();
  updateReadyState();
});

for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!busy) dropZone.classList.add('drag-over');
  });
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
  });
}
dropZone.addEventListener('drop', (event) => selectFile(event.dataTransfer?.files?.[0]));

splitButton.addEventListener('click', async () => {
  if (!selectedFile || busy || duration <= 0) return;
  let maxBytes;
  try {
    maxBytes = sizeLimitBytes(sizeInput.value);
  } catch {
    showError('errorLimit');
    return;
  }

  clearResults();
  hideError();
  busy = true;
  cancelled = false;
  splitButton.disabled = true;
  fileInput.disabled = true;
  sizeInput.disabled = true;
  $('remove-file').disabled = true;
  progressSection.classList.remove('hidden');

  try {
    parts = await splitVideo(selectedFile, maxBytes, duration, {
      onEngine: (instance) => { engine = instance; },
      isCancelled: () => cancelled,
      onStatus: setStatus,
    });
    if (!cancelled) renderResults();
    else clearResults();
  } catch (error) {
    if (!cancelled) {
      const knownErrors = ['errorNoParts', 'errorMount', 'errorProcessing', 'errorTooLarge'];
      showError(error instanceof Error && knownErrors.includes(error.message) ? error.message : 'errorGeneric');
    }
  } finally {
    busy = false;
    engine = null;
    fileInput.disabled = false;
    sizeInput.disabled = false;
    $('remove-file').disabled = false;
    progressSection.classList.add('hidden');
    updateReadyState();
  }
});

$('cancel-button').addEventListener('click', () => {
  cancelled = true;
  setStatus('cancelling', 'cancellingDetail');
  engine?.terminate();
});

applyLanguage();
