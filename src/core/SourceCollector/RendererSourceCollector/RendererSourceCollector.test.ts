import RendererSourceCollector from './index';
import IpcManagerMock from '../../IpcManager/IpcManagerMock';

describe('RendererSourceCollector', () => {
  test('Obtaining sources available, should obtain a set of sources', async () => {
    const ipcManager = new IpcManagerMock();
    const sourceCollector = new RendererSourceCollector(ipcManager);
    const expectedSources = [{ name: 'screen', id: 'screen-1' }];

    ipcManager.handle('screenSources', () => ({
      sources: expectedSources,
    }));

    expect(await sourceCollector.sources()).toEqual(expectedSources);
  });
});
