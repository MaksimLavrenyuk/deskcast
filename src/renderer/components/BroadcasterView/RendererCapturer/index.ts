import { SourceCollector } from '../../../../core/SourceCollector/types';
import { IpcManagerI } from '../../../../utils/IpcManager';

export default class RendererCapturer implements SourceCollector {
  ipc: IpcManagerI;

  constructor(ipcRenderer: IpcManagerI) {
    this.ipc = ipcRenderer;
  }

  sources = async () => {
    const response = await this.ipc.invoke('screenSources');

    return response.sources;
  };
}
