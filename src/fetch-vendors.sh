
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p vendor/mammoth/1.6.0 vendor/jspdf/2.5.1 vendor/html2canvas/1.4.1 vendor/pdfjs/3.11.174 vendor/jszip/3.10.1

curl -L https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js      -o vendor/mammoth/1.6.0/mammoth.browser.min.js
curl -L https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js               -o vendor/jspdf/2.5.1/jspdf.umd.min.js
curl -L https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js       -o vendor/html2canvas/1.4.1/html2canvas.min.js
curl -L https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js                 -o vendor/pdfjs/3.11.174/pdf.min.js
curl -L https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js          -o vendor/pdfjs/3.11.174/pdf.worker.min.js
curl -L https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js                  -o vendor/jszip/3.10.1/jszip.min.js

echo "
Done. Files saved under ./vendor/"
