import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = process.cwd();
const CAPTURE_URL = process.env.CAPTURE_URL || 'http://127.0.0.1:4173/src/Tesserly.html';
const OUT_DIRS = [
  path.join(ROOT, 'src', 'features'),
  path.join(ROOT, 'public', 'features'),
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeToOutputs(fileName, buffer) {
  for (const outputDir of OUT_DIRS) {
    ensureDir(outputDir);
    fs.writeFileSync(path.join(outputDir, fileName), buffer);
  }
}

async function saveFocusedPng(page, selector, outFileName) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const screenshot = await locator.screenshot({ type: 'png' });
  const finalPng = await sharp(screenshot)
    .resize(1280, 720, { fit: 'cover', position: 'attention' })
    .png({ quality: 92 })
    .toBuffer();
  writeToOutputs(outFileName, finalPng);
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

    STATE.folders = [
      { id: 'f-cardio', name: 'Cardiology' },
      { id: 'f-renal', name: 'Renal' }
    ];

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

    STATE.openFolders = ['f-cardio', 'f-renal'];

    if (typeof enterApp === 'function') enterApp();
    if (typeof goToApp === 'function') goToApp('notes');
  });

  await sleep(1000);
}

async function captureNotes(page) {
  await page.evaluate(() => goToApp('notes'));
  await sleep(900);
  await saveFocusedPng(page, '#content .notes-workspace', 'import-notes.png');
}

async function captureQuestions(page) {
  await page.evaluate(() => {
    goToApp('questions');
    STATE.questions = [
      {
        question: 'A 54-year-old with crushing chest pain and ST elevation in V1-V4 most likely has occlusion of which artery?',
        options: {
          A: 'Right coronary artery',
          B: 'Left anterior descending artery',
          C: 'Left circumflex artery',
          D: 'Posterior descending artery',
          E: 'Left main coronary artery'
        },
        answer: 'B',
        explanation: 'V1-V4 localizes to anterior wall ischemia, classically LAD territory.',
        topic: 'Cardiology · Step 1'
      }
    ];
    STATE.selectedAnswers = { 0: 'B' };
    STATE.revealed = { 0: true };
    renderQuestions();
  });
  await sleep(900);
  await saveFocusedPng(page, '#content', 'usmle-practice.png');
}

async function captureSummarize(page) {
  await page.evaluate(() => goToApp('summarize'));
  await sleep(900);
  await page.evaluate(() => {
    const styleSel = document.getElementById('sum-style');
    if (styleSel) styleSel.value = 'highyield';
    const lenSel = document.getElementById('sum-length');
    if (lenSel) lenSel.value = 'long';
    const prompt = document.getElementById('sum-prompt');
    if (prompt) prompt.value = 'Focus on mechanisms, high-yield exam traps, and concise review bullets.';
  });
  await saveFocusedPng(page, '#content .revamp-sum-grid', 'summarize.png');
}

async function captureAnki(page) {
  await page.evaluate(() => {
    goToApp('anki');
    STATE.ankiCards = [
      {
        front: 'Most common cause of MI in adults?',
        back: 'Atherosclerotic plaque rupture with superimposed thrombus.',
        topic: 'Cardiology',
        hint: 'Think coronary thrombosis.'
      },
      {
        front: 'Cloze: Beta blockers reduce {{c1::myocardial oxygen demand}} by lowering HR/contractility.',
        back: 'They decrease heart rate and contractility, reducing oxygen demand.',
        topic: 'Pharmacology',
        hint: 'Hemodynamic effect.'
      }
    ];
    STATE.ankiFlipped = {};
    renderAnki();
  });
  await sleep(900);
  await saveFocusedPng(page, '#content #anki-results', 'anki-generator.png');
}

async function main() {
  for (const outDir of OUT_DIRS) ensureDir(outDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  await page.goto(CAPTURE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(1200);
  await seedDemoState(page);

  await captureNotes(page);
  await captureQuestions(page);
  await captureSummarize(page);
  await captureAnki(page);

  await browser.close();
  console.log('feature-images-captured');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
