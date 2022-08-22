import { app, BrowserWindow } from 'electron';
import path from 'path';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */
}

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export default function createAppWindow(): BrowserWindow {
  // Create new window instance
  appWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    icon: path.resolve('assets/images/appIcon.ico'),
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
  appWindow.webContents.openDevTools();

  // Show window when its ready to
  appWindow.on('ready-to-show', () => appWindow.show());

  // Register Inter Process Communication for main process
  registerMainIPC();

  // Close all windows when main window is closed
  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}
