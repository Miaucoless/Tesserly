#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const srcDir = path.join(root, 'src');

function copyDirectoryRecursive(sourceDir, destinationDir) {
  if (!fs.existsSync(sourceDir)) return;
  fs.mkdirSync(destinationDir, { recursive: true });
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

fs.mkdirSync(publicDir, { recursive: true });

// Copy main HTML
fs.copyFileSync(path.join(srcDir, 'Tesserly.html'), path.join(publicDir, 'index.html'));

// Copy supabase-config.js if it exists (for local dev or when not using env)
const configSrc = path.join(srcDir, 'supabase-config.js');
if (fs.existsSync(configSrc)) {
  fs.copyFileSync(configSrc, path.join(publicDir, 'supabase-config.js'));
}

// Copy feature media assets (SVG/GIF/etc.) used by landing page cards
copyDirectoryRecursive(path.join(srcDir, 'features'), path.join(publicDir, 'features'));

// Inject Supabase URL/key from env into index.html (Vercel: set SUPABASE_URL + SUPABASE_ANON_KEY)
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (url && key) {
  const indexPath = path.join(publicDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const escapedUrl = url.replace(/'/g, "\\'").replace(/\\/g, '\\\\');
  const escapedKey = key.replace(/'/g, "\\'").replace(/\\/g, '\\\\');
  const inject = `<script>window.SUPABASE_URL='${escapedUrl}';window.SUPABASE_ANON_KEY='${escapedKey}';</script>`;
  html = html.replace('<!-- INJECT_SUPABASE_ENV -->', inject);
  fs.writeFileSync(indexPath, html);
}

console.log('build:web done');
