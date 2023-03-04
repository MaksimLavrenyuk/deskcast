import IpcManagerMock from '../../IpcManager/IpcManagerMock';
import RendererGetterWatcherURL from './index';

test('Should get the url of where the server is running with Watcher', async () => {
  const ipcManager = new IpcManagerMock();
  const watcherURL = new RendererGetterWatcherURL(ipcManager);
  const expectedURL = 'http://localhost:8080';

  ipcManager.handle('watcherUrl', () => ({
    url: expectedURL,
  }));

  expect(await watcherURL.url()).toEqual(expectedURL);
});
