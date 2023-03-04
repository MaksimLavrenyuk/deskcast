import React, {
  useCallback, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react';
import VideoViewer from './VideoViewer';
import StartScreen from './StartScreen';
import ControlPane from './ControlPane';
import ScreensModal from './Screens/ScreenModal';
import WatcherLink from './WatcherLink';
import Screens from './Screens';
import classes from './BroadcasterView.module.scss';
import BroadcasterView, { SelectScreen } from './BroadcasterView';
import RendererSourceCollector from '../../../core/SourceCollector/RendererSourceCollector';
import IpcManager from '../../../core/IpcManager';
import RendererGetterWatcherURL from '../../../core/GetterWatcherURL/RendererGetterWatcherURL';

function Broadcaster() {
  const broadcasterView = useMemo(() => {
    const ipcManager = IpcManager.getInRenderer();

    return new BroadcasterView({
      sourceCollector: new RendererSourceCollector(ipcManager),
      getterWatcherURL: new RendererGetterWatcherURL(ipcManager),
    });
  }, []);
  const activeScreen = broadcasterView.activeScreen();
  const [openSelector, setOpenSelector] = useState(false);

  const selectScreenHandler: SelectScreen = useCallback((screenID) => {
    setOpenSelector(false);
    broadcasterView.selectScreen(screenID);
  }, [broadcasterView]);

  const cancelStreamHandler = useCallback(() => {
    broadcasterView.reset();
  }, [broadcasterView]);

  const selectScreenRequestHandler = useCallback(() => {
    setOpenSelector(true);
  }, []);
  const cancelSelectScreenHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  return (
    <div className={classes.broadcaster}>
      {!activeScreen && (
        <StartScreen
          onStart={selectScreenRequestHandler}
          watcherLink={
            <WatcherLink getWatcherURL={broadcasterView.watcher} />
          }
        />
      )}
      {activeScreen && (
        <>
          <VideoViewer video={activeScreen.stream} />
          <ControlPane
            className={classes.controlPane}
            requestChangeScreen={selectScreenRequestHandler}
            onCancelStream={cancelStreamHandler}
            watcherLink={
              <WatcherLink getWatcherURL={broadcasterView.watcher} />
            }
          />
        </>
      )}
      <ScreensModal open={openSelector} onCancel={cancelSelectScreenHandler}>
        <Screens
          onSelect={selectScreenHandler}
          getScreens={broadcasterView.getScreens}
        />
      </ScreensModal>
    </div>
  );
}

export default observer(Broadcaster);
