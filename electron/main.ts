import { app, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from "electron-updater";
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as fs from "fs";
import { initDatabase, initDBCommands } from './libraries/db.js'
import { initExportCommands } from './libraries/export.js'

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools(); // Open DevTools if the app is running in development mode.
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    win.once('ready-to-show', () => {
      // Check for updates without auto-downloading after the app is ready
      autoUpdater.autoDownload = false;
      autoUpdater.checkForUpdatesAndNotify();
    });
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit()
  win = null
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

let db: any
app.whenReady().then(() => {
  db = initDatabase(path, Database);
  createWindow();
  initDBCommands(db);
  initExportCommands(fs);
})

// show dialogs for update events
autoUpdater.on('update-available', async (info) => {
  if (!win) {
    return;
  }
  const { response } = await dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['Later', 'Download'], // Left = Later, Right = Download
    defaultId: 1,                   // Highlight Download button
    cancelId: 0,                    // Esc = Later
    title: 'Update available',
    message: `Version ${info.version} is available. Do you want to download it now?`
  });

  if (response === 1) {
    autoUpdater.downloadUpdate();
  }
});

autoUpdater.on('download-progress', (progress) => {
  if (!win) {
    return;
  }
  // Use taskbar/dock progress
  win.setProgressBar(progress.percent / 100);
});

autoUpdater.on('update-downloaded', async () => {
  if (!win) {
    return;
  }
  // reset progress bar when done
  win.setProgressBar(-1);

  // show dialog to confirm update installation
  const { response } = await dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['Later', 'Install Now'], // Left = Later, Right = Install Now
    defaultId: 1,                      // Highlight Install Now
    cancelId: 0,
    title: 'Update ready',
    message: 'The update has been downloaded. Do you want to install it now?'
  });

  if (response === 1) {
    autoUpdater.quitAndInstall();
  }
});
