import { BrowserWindow, IpcMain } from 'electron';
import {
  FromMainToRendererEvents, FromRendererToMainEvents, FromRendererToMainListener, IpcMainManager,
} from '../types';

export default class IpcMainManagerImpl implements IpcMainManager {
  private ipc: Electron.IpcMain;

  private appWindow: Electron.CrossProcessExports.BrowserWindow;

  constructor(ipcMain: IpcMain, appWindow: BrowserWindow) {
    this.send = this.send.bind(this);
    this.on = this.on.bind(this);
    this.ipc = ipcMain;
    this.appWindow = appWindow;
  }

  // eslint-disable-next-line class-methods-use-this
  send<Event extends keyof FromMainToRendererEvents>(event: Event, payload?: FromMainToRendererEvents[Event]) {
    this.appWindow.webContents.send(event, payload);
  }

  on<Event extends keyof FromRendererToMainEvents>(event: Event, listener: FromRendererToMainListener<Event>) {
    this.ipc.on(event, (e, payloadData) => listener(payloadData));
  }
}
