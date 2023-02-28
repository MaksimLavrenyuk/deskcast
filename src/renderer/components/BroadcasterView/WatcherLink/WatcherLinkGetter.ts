import { WatcherLinkGetterI } from '../../../../core/WatcherLinkGetter/types';
import { IpcManagerI } from '../../../../core/IpcManager/types';

class WatcherLinkGetter implements WatcherLinkGetterI {
  ipc: IpcManagerI;

  constructor(ipcRenderer: IpcManagerI) {
    this.ipc = ipcRenderer;
  }

  link = async () => {
    const response = await this.ipc.invoke('watcherUrl');

    return response.url;
  };
}

export default WatcherLinkGetter;
