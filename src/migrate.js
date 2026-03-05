// src/migrate.js
const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');
const paths = require('./userDataPaths');

async function migrateOnce() {
  const stamp = path.join(paths.base(), '.migrated-1');
  try { 
    await fs.access(stamp);
    return; // migration already done
  } catch {}

  // Example: move files from old ./uploads directory into userData/imported
  const oldDir = path.join(app.getAppPath(), 'uploads');
  const newDir = paths.importedDir();

  try {
    await fs.mkdir(newDir, { recursive: true });
    const files = await fs.readdir(oldDir);
    for (const f of files) {
      await fs.copyFile(path.join(oldDir, f), path.join(newDir, f));
    }
  } catch {}

  await fs.writeFile(stamp, 'done');
}

module.exports = { migrateOnce };
