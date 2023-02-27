import {
  app, BrowserWindow, desktopCapturer, ipcMain,
} from 'electron';
import path from 'path';
import IpcManager from '../utils/IpcManager';
import WatcherServer from '../watcher-web/server';
import { inDev } from '../common/helpers';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const watcherServer = new WatcherServer();

/**
 * Register Inter Process Communication
 */
function registerMainIPC(appWindow: BrowserWindow) {
  const impManager = new IpcManager({ ipcMain });

  impManager.handle('screenSources', async () => {
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    const sourcesData = [];

    for (const source of sources) {
      sourcesData.push({
        name: source.name,
        id: source.id,
      });
    }

    return { sources: sourcesData };
  });

  impManager.handle('watcherUrl', () => ({ url: watcherServer.getWatcherServerLink() }));
}

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export default function createAppWindow(): BrowserWindow {
  // Create new window instance
  let appWindow = new BrowserWindow({
    width: 1200,
    height: 1200,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    icon: path.resolve('assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html of the app window.
  appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

  if (inDev()) appWindow.webContents.openDevTools();

  // Show window when its ready to
  appWindow.on('ready-to-show', () => appWindow.show());

  // Register Inter Process Communication for main process
  registerMainIPC(appWindow);

  // Close all windows when main window is closed
  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}
