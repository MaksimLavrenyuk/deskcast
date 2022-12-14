import { SourceCollector, Source } from '../../../../core/SourceCollector/types';
import { IpcRendererManager } from '../../../../utils';

export default class RendererCapturer implements SourceCollector {
  private readonly sourcesWaiter: Promise<Source[]>;

  ipc: IpcRendererManager;

  constructor(ipcRenderer: IpcRendererManager) {
    this.ipc = ipcRenderer;

    this.sourcesWaiter = new Promise((resolve) => {
      this.ipc.on('DESKTOP_CAPTURE_SOURCES', (payload) => {
        resolve([...payload.sources]);
      });
    });
  }

  sources = () => {
    this.ipc.send('GET_DESKTOP_CAPTURE_SOURCES');

    return this.sourcesWaiter;
  };
}
