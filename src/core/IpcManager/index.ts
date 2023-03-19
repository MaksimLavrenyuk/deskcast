import { ContextBridge } from 'electron';
import { IpcManagerI, IpcChannels, IpcHandler } from './types';

const managerInRenderer = 'ipcManager';

declare global {
  interface Window {
    [managerInRenderer]: IpcManagerI
  }
}

type IpcManagerProps = {
  ipcRenderer?: Electron.IpcRenderer,
  ipcMain?: Electron.IpcMain,
}

export default class IpcManager implements IpcManagerI {
  private ipcRenderer?: Electron.IpcRenderer;

  private ipcMain?: Electron.IpcMain;

  public static installInRenderer(bridge: ContextBridge, props: IpcManagerProps) {
    bridge.exposeInMainWorld(managerInRenderer, new IpcManager(props));
  }

  public static getInRenderer() {
    return window[managerInRenderer];
  }

  constructor(props: IpcManagerProps) {
    this.ipcRenderer = props?.ipcRenderer;
    this.ipcMain = props?.ipcMain;
  }

  invoke = <Channel extends keyof IpcChannels>(channel: Channel, data?: IpcChannels[Channel]):
    Promise<IpcChannels[Channel]> => this.ipcRenderer.invoke(channel, data);

  handle = <Channel extends keyof IpcChannels>(
    channel: Channel,
    handler: IpcHandler<Channel>,
  ) => {
    this.ipcMain.handle(channel, (event, ...args) => handler(args[0]));
  };
}
