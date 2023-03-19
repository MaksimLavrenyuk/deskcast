import { GetterWatcherURLI } from '../types';
import { IpcManagerI } from '../../IpcManager/types';

class RendererGetterWatcherURL implements GetterWatcherURLI {
  ipc: IpcManagerI;

  constructor(ipcRenderer: IpcManagerI) {
    this.ipc = ipcRenderer;
  }

  url = async () => {
    const response = await this.ipc.invoke('watcherUrl');

    return response.url;
  };
}

export default RendererGetterWatcherURL;
