// src/userDataPaths.js
const { app } = require('electron');
const path = require('path');

function base() {
  return app.getPath('userData'); // Safe, persistent folder
}

module.exports = {
  base,
  importedDir: () => path.join(base(), 'imported'),
  exportsDir:  () => path.join(base(), 'exports'),
  settings:    () => path.join(base(), 'settings.json')
};
