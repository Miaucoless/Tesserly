
# Tesserly Vendor & Fonts Kit (drop into your Electron project's src/)

## What this contains
- ./vendor/ folders for these libs and versions:
  - mammoth 1.6.0
  - jspdf 2.5.1
  - html2canvas 1.4.1
  - pdf.js 3.11.174 (with pdf.worker.min.js)
  - jszip 3.10.1
- ./fonts/ with a fonts.css template (+ README) for Geist, Geist Mono, Instrument Serif
- Scripts to download the exact files from cdnjs:
  - fetch-vendors.sh (macOS/Linux)
  - fetch-vendors.ps1 (Windows)

## How to use
1) Copy everything from this kit's `src/` into your Electron project's `src/` folder.
2) Run one of the fetch scripts **from inside src/** to pull vendor JS files.
3) Put your WOFF2 font binaries in `src/fonts/` (see fonts/README.md), then include `<link rel="stylesheet" href="./fonts/fonts.css">` in your HTML.
4) Update your HTML <script> tags to the local paths, e.g.:

   ```html
   <script src="./vendor/mammoth/1.6.0/mammoth.browser.min.js"></script>
   <script src="./vendor/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="./vendor/html2canvas/1.4.1/html2canvas.min.js"></script>
   <script src="./vendor/pdfjs/3.11.174/pdf.min.js"></script>
   <script src="./vendor/jszip/3.10.1/jszip.min.js"></script>
   <script>if(window.pdfjsLib){ pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdfjs/3.11.174/pdf.worker.min.js'; }</script>
   ```

5) Start your Electron app:
   ```bash
   npm install
   npm start
   ```

## Tip
If your HTML previously used Google Fonts via a <link> to fonts.googleapis, remove that and include `./fonts/fonts.css` instead so fonts work offline.
