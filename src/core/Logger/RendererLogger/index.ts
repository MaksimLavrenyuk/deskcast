import Logger, { Log } from '../types';
import { IpcManagerI } from '../../IpcManager/types';

export default class RendererLogger implements Logger {
  private ipcRenderer: IpcManagerI;

  constructor(ipcRenderer: IpcManagerI) {
    this.ipcRenderer = ipcRenderer;
  }

  write(log: Log) {
    this.ipcRenderer.invoke('log', log);
  }
}