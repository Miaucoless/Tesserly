// src/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// --- Auto-update (electron-updater) ---
const { autoUpdater } = require('electron-updater');

// Optional: logging for updater
try {
  const log = require('electron-log');
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  console.log('AutoUpdater: logger initialized');
} catch (e) {
  console.log('AutoUpdater: logger not initialized (optional).');
}

// Only run updates in packaged (production) builds
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'Tesserly',
    backgroundColor: '#0d1018',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'Tesserly.html'));
}

// ---- App lifecycle ----
app.whenReady().then(() => {
  createWindow();

  // Start auto-update checks only in production
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---- Updater events: log + forward to renderer ----
function broadcast(channel, payload) {
  const wins = BrowserWindow.getAllWindows();
  for (const win of wins) {
    try {
      win.webContents.send(channel, payload);
    } catch (_) {}
  }
}

autoUpdater.on('checking-for-update', () => {
  console.log('Updater: checking for update…');
  broadcast('update-checking', null);
});

autoUpdater.on('update-available', info => {
  console.log('Updater: update available →', info.version);
  broadcast('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  console.log('Updater: no update available');
  broadcast('update-not-available', null);
});

autoUpdater.on('error', err => {
  console.error('Updater error:', err);
  broadcast('update-error', err ? { message: err.message || String(err) } : null);
});

autoUpdater.on('download-progress', p => {
  console.log(`Updater: ${Math.round(p.percent)}%`);
  broadcast('update-download-progress', {
    percent: p.percent,
    transferred: p.transferred,
    total: p.total,
    bytesPerSecond: p.bytesPerSecond
  });
});

autoUpdater.on('update-downloaded', info => {
  console.log('Updater: update downloaded; will install on quit');
  broadcast('update-downloaded', info);
});

// Allow renderer to trigger install
ipcMain.on('update-quit-and-install', () => {
  autoUpdater.quitAndInstall();
});
