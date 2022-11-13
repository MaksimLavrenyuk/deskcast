import { IpcRendererManager } from '../../../../utils';
import { WatcherLinkGetterI } from '../../../../core/WatcherLinkGetter/types';

class WatcherLinkGetter implements WatcherLinkGetterI {
  private readonly linkWaiter: Promise<string>;

  ipc: IpcRendererManager;

  constructor(ipcRenderer: IpcRendererManager) {
    this.ipc = ipcRenderer;

    this.linkWaiter = new Promise((resolve) => {
      this.ipc.on('WATCHER_LINK', (payload) => {
        resolve(payload.link);
      });
    });
  }

  link = () => {
    this.ipc.send('GET_WATCHER_LINK');

    return this.linkWaiter;
  };
}

export default WatcherLinkGetter;
