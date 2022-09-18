import { ContextBridge, IpcRenderer } from 'electron';
import {
  IpcRendererManager, FromMainToRendererEvents, FromRendererToMainEvents, FromMainToRendererListener,
} from '../types';

const ipcRendererManagerVariable = 'ipcRendererManager';

declare global {
  interface Window {
    [ipcRendererManagerVariable]: IpcRendererManager
  }
}

export default class IpcRendererManagerImpl implements IpcRendererManager {
  public static install(bridge: ContextBridge, ipcRenderer: IpcRenderer) {
    bridge.exposeInMainWorld(ipcRendererManagerVariable, new IpcRendererManagerImpl(ipcRenderer));
  }

  public static get() {
    return window[ipcRendererManagerVariable];
  }

  private ipc: Electron.IpcRenderer;

  constructor(ipcRenderer: IpcRenderer) {
    this.send = this.send.bind(this);
    this.on = this.on.bind(this);
    this.ipc = ipcRenderer;
  }

  send<Event extends keyof FromRendererToMainEvents>(event: Event, payload?: FromRendererToMainEvents[Event]) {
    this.ipc.send(event, payload);
  }

  on<Event extends keyof FromMainToRendererEvents>(event: Event, listener: FromMainToRendererListener<Event>) {
    this.ipc.on(event, (e, payloadData) => listener(payloadData));
  }
}
