import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import gifencPkg from 'gifenc';
import sharp from 'sharp';

const { GIFEncoder, quantize, applyPalette } = gifencPkg;

const ROOT = process.cwd();
const CAPTURE_URL = process.env.CAPTURE_URL || 'http://127.0.0.1:4173/src/Tesserly.html';
const OUT_DIRS = [
  path.join(ROOT, 'public', 'features'),
  path.join(ROOT, 'src', 'features')
];
const FPS = 9;
const FRAME_DELAY_CENTISECONDS = Math.round(100 / FPS);
const TOTAL_FRAMES = 28;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeGifToAllOutputs(fileName, bytes) {
  for (const outputDir of OUT_DIRS) {
    ensureDir(outputDir);
    fs.writeFileSync(path.join(outputDir, fileName), bytes);
  }
}

async function encodeGifFromPngBuffers(frameBuffers, outFileName) {
  if (!frameBuffers.length) return;
  const decoded = [];
  for (const frameBuffer of frameBuffers) {
    const { data, info } = await sharp(frameBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    decoded.push({ data, width: info.width, height: info.height });
  }

  const width = decoded[0].width;
  const height = decoded[0].height;

  const gif = GIFEncoder();
  for (const frame of decoded) {
    const rgba = frame.data;
    const palette = quantize(rgba, 256);
    const indexed = applyPalette(rgba, palette);
    gif.writeFrame(indexed, width, height, {
      palette,
      delay: FRAME_DELAY_CENTISECONDS,
      transparent: false,
      dispose: 0,
    });
  }
  gif.finish();
  writeGifToAllOutputs(outFileName, Buffer.from(gif.bytes()));
}

async function captureClip(page, tabId, outFileName, frameAction) {
  await page.evaluate((tab) => {
    if (typeof goToApp === 'function') {
      goToApp(tab);
      return;
    }
    if (typeof navigate === 'function') navigate(tab);
  }, tabId);
  await sleep(850);

  const content = page.locator('#content');
  await content.waitFor({ state: 'visible', timeout: 10000 });
  const frameBuffers = [];

  for (let frame = 0; frame < TOTAL_FRAMES; frame += 1) {
    if (typeof frameAction === 'function') {
      await frameAction(page, frame);
    }
    frameBuffers.push(await content.screenshot({ type: 'png' }));
    await sleep(1000 / FPS);
  }

  await encodeGifFromPngBuffers(frameBuffers, outFileName);
}

async function seedDemoState(page) {
  await page.evaluate(() => {
    if (!AUTH.currentUser) {
      AUTH.currentUser = {
        name: 'Demo User',
        email: 'demo@local.test',
        username: 'demo',
        avatar: ''
      };
    }

    if (!Array.isArray(STATE.folders) || !STATE.folders.length) {
      STATE.folders = [
        { id: 'f-cardio', name: 'Cardiology' },
        { id: 'f-renal', name: 'Renal' }
      ];
    }

    if (!Array.isArray(STATE.notes) || STATE.notes.length < 3) {
      STATE.notes = [
        {
          id: 'n-1',
          name: 'Cardiology Lecture',
          content: 'STEMI localization, coronary blood supply, preload/afterload relationships, and heart failure mechanisms.',
          date: '3/11/2026',
          fileName: 'cardiology.txt',
          folderId: 'f-cardio'
        },
        {
          id: 'n-2',
          name: 'Renal Acid-Base',
          content: 'Winter formula, metabolic acidosis causes, AG interpretation, and respiratory compensation details.',
          date: '3/11/2026',
          fileName: 'renal.txt',
          folderId: 'f-renal'
        },
        {
          id: 'n-3',
          name: 'Pharm Rapid Review',
          content: 'Beta blockers, calcium channel blockers, antiarrhythmics, and adverse effects with clinical clues.',
          date: '3/11/2026',
          fileName: 'pharm.md'
        }
      ];
    }

    if (typeof enterApp === 'function') enterApp();
    if (typeof goToApp === 'function') goToApp('notes');
  });

  await sleep(1200);
}

async function main() {
  for (const outputDir of OUT_DIRS) ensureDir(outputDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1480, height: 980 } });

  await page.goto(CAPTURE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(1200);
  await seedDemoState(page);

  await captureClip(page, 'notes', 'import-notes.gif', async (p, frame) => {
    if (frame === 8) {
      await p.evaluate(() => { if (typeof toggleNoteSidebar === 'function') toggleNoteSidebar(); });
    }
    if (frame === 16) {
      await p.evaluate(() => { if (typeof toggleNoteSidebar === 'function') toggleNoteSidebar(); });
    }
  });

  await captureClip(page, 'questions', 'usmle-practice.gif', async (p, frame) => {
    if (frame === 6) {
      await p.evaluate(() => {
        const noteSel = document.getElementById('q-note-sel');
        if (noteSel && noteSel.options.length > 1) noteSel.selectedIndex = 1;
        const stepSel = document.getElementById('q-diff');
        if (stepSel) stepSel.value = 'Step 2';
      });
    }
    if (frame === 14) {
      await p.evaluate(() => {
        const numSel = document.getElementById('q-num');
        if (numSel) numSel.value = '20';
      });
    }
  });

  await captureClip(page, 'summarize', 'summarize.gif', async (p, frame) => {
    if (frame === 6) {
      await p.evaluate(() => {
        const styleSel = document.getElementById('sum-style');
        if (styleSel) styleSel.value = 'highyield';
      });
    }
    if (frame === 12) {
      await p.evaluate(() => {
        const lenSel = document.getElementById('sum-length');
        if (lenSel) lenSel.value = 'long';
      });
    }
  });

  await captureClip(page, 'anki', 'anki-generator.gif', async (p, frame) => {
    if (frame === 8) {
      await p.evaluate(() => { if (typeof switchAnkiMode === 'function') switchAnkiMode('cloze'); });
    }
    if (frame === 16) {
      await p.evaluate(() => { if (typeof switchAnkiMode === 'function') switchAnkiMode('basic'); });
    }
    if (frame === 23) {
      await p.evaluate(() => { if (typeof switchAnkiMode === 'function') switchAnkiMode('custom'); });
    }
  });

  await browser.close();
  console.log('feature-gifs-captured');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
