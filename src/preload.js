// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Validate inputs defensively in preload before crossing the bridge
function assertString(name, v) {
  if (typeof v !== 'string' || !v.length) {
    throw new TypeError(`${name} must be a non-empty string`);
  }
}

function toArrayBuffer(maybe) {
  // Accept ArrayBuffer, TypedArray, DataView, or Node Buffer
  if (maybe instanceof ArrayBuffer) return maybe;
  if (ArrayBuffer.isView(maybe)) return maybe.buffer;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(maybe)) {
    return maybe.buffer.slice(maybe.byteOffset, maybe.byteOffset + maybe.byteLength);
  }
  throw new TypeError('arrayBuffer must be ArrayBuffer, TypedArray, DataView, or Buffer');
}

contextBridge.exposeInMainWorld('tesserly', {
  /**
   * Save an imported file into the app's persistent userData/imported folder.
   * @param {string} fileName - The file name to write (no path traversal).
   * @param {ArrayBuffer|TypedArray|DataView|Buffer} arrayBuffer - File contents.
   * @returns {Promise<string>} Absolute target path written by the main process.
   */
  saveImported: async (fileName, arrayBuffer) => {
    assertString('fileName', fileName);

    // Optional: basic filename hygiene to prevent path traversal
    if (fileName.includes('/') || fileName.includes('\\')) {
      throw new Error('fileName must not include path separators');
    }

    const ab = toArrayBuffer(arrayBuffer);
    return ipcRenderer.invoke('save-imported', fileName, ab);
  },

  // Optional: add a ping for health checks
  ping: () => 'pong',

  // Auto-update bridge
  update: {
    onChecking: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-checking', () => handler());
      }
    },
    onAvailable: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-available', (_event, info) => handler(info));
      }
    },
    onNotAvailable: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-not-available', () => handler());
      }
    },
    onError: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-error', (_event, payload) => handler(payload));
      }
    },
    onDownloadProgress: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-download-progress', (_event, progress) => handler(progress));
      }
    },
    onDownloaded: (handler) => {
      if (typeof handler === 'function') {
        ipcRenderer.on('update-downloaded', (_event, info) => handler(info));
      }
    },
    quitAndInstall: () => {
      ipcRenderer.send('update-quit-and-install');
    }
  }
});
