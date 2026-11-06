# ClipCut

A browser-only video splitter. Node.js is used to run and build the app; the video processing itself runs in the browser with FFmpeg WebAssembly. Files are selected locally and are never uploaded or saved on a server.

The interface supports English and Thai. Use the EN/TH switch in the header; the choice is saved in this browser. If no choice has been saved, ClipCut follows the browser language.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build`; the static files are placed in `dist/`.

## How it works

1. Pick or drop one video and choose a maximum size in decimal MB (1 MB = 1,000,000 bytes).
2. ClipCut first splits with stream copy, preserving the original video and audio quality. If keyframe spacing prevents parts from fitting the limit, it re-encodes as H.264/AAC.
3. Every generated MP4 is measured before download links appear. If the limit cannot be met, the app reports an error instead of offering an oversized part.

The FFmpeg engine is served as a local static asset by Vite; no CDN or upload service is needed at runtime. Large videos can still exceed the browser's available memory. Keep the tab open until all parts have been downloaded, since generated files are held only in memory.
