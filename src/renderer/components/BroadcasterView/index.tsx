import React, {
  useCallback, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react';
import {
  Space,
} from 'antd';
import VideoViewer from './StreamViewer';
import StartScreen from './Starter';
import ControlPane from '../ControlPane';
import ScreensModal from './Screens/ScreenModal';
import WatcherLink from './WatcherLink';
import WatcherLinkPane from './WatcherLink/WatcherLinkPane';
import Screens from './Screens';
import classes from './BroadcasterView.module.scss';
import BroadcasterViewStore, { SelectScreen } from './BroadcacterViewStore';
import RendererSourceCollector from '../../../core/SourceCollector/RendererSourceCollector';
import IpcManager from '../../../core/IpcManager';
import RendererGetterWatcherURL from '../../../core/GetterWatcherURL/RendererGetterWatcherURL';
import WatcherLinkBtn from './WatcherLink/WatcherLinkBtn';
import ChangeScreenControl from './Controls/ChangeScreenControl';
import CancelControl from './Controls/CancelControl';

function Broadcaster() {
  const broadcasterView = useMemo(() => {
    const ipcManager = IpcManager.getInRenderer();

    return new BroadcasterViewStore({
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

  const changeScreenHandler = useCallback(() => {
    setOpenSelector(true);
  }, []);
  const cancelSelectScreenHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  return (
    <div className={classes.broadcaster}>
      {!activeScreen && (
        <StartScreen
          onStart={changeScreenHandler}
          watcherLink={(
            <WatcherLinkPane>
              <WatcherLink size="large" getWatcherURL={broadcasterView.watcher} />
            </WatcherLinkPane>
          )}
        />
      )}
      {activeScreen && (
        <>
          <VideoViewer stream={activeScreen.stream} />
          <ControlPane>
            <Space wrap>
              <WatcherLinkBtn watcherLink={<WatcherLink getWatcherURL={broadcasterView.watcher} />} />
              <ChangeScreenControl onChange={changeScreenHandler} />
              <CancelControl onCancel={cancelStreamHandler} />
            </Space>
          </ControlPane>
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
