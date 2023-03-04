import { SourceCollector } from '../types';
import { IpcManagerI } from '../../IpcManager/types';

export default class RendererSourceCollector implements SourceCollector {
  ipc: IpcManagerI;

  constructor(ipcManager: IpcManagerI) {
    this.ipc = ipcManager;
  }

  sources = async () => {
    const response = await this.ipc.invoke('screenSources');

    return response.sources;
  };
}
