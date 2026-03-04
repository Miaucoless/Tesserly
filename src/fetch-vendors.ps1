
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path vendor/mammoth/1.6.0, vendor/jspdf/2.5.1, vendor/html2canvas/1.4.1, vendor/pdfjs/3.11.174, vendor/jszip/3.10.1 | Out-Null

Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js -OutFile vendor/mammoth/1.6.0/mammoth.browser.min.js
Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js -OutFile vendor/jspdf/2.5.1/jspdf.umd.min.js
Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js -OutFile vendor/html2canvas/1.4.1/html2canvas.min.js
Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js -OutFile vendor/pdfjs/3.11.174/pdf.min.js
Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js -OutFile vendor/pdfjs/3.11.174/pdf.worker.min.js
Invoke-WebRequest https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js -OutFile vendor/jszip/3.10.1/jszip.min.js

Write-Host "`nDone. Files saved under ./vendor/"
