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
import classes from './StreamerView.module.scss';
import StreamerViewStore, { SelectScreen } from './StreamerViewStore';
import RendererSourceCollector from '../../../core/SourceCollector/RendererSourceCollector';
import IpcManager from '../../../core/IpcManager';
import RendererGetterWatcherURL from '../../../core/GetterWatcherURL/RendererGetterWatcherURL';
import WatcherLinkBtn from './WatcherLink/WatcherLinkBtn';
import ChangeScreenControl from './Controls/ChangeScreenControl';
import CancelControl from './Controls/CancelControl';

function Streamer() {
  const streamer = useMemo(() => {
    const ipcManager = IpcManager.getInRenderer();

    return new StreamerViewStore({
      sourceCollector: new RendererSourceCollector(ipcManager),
      getterWatcherURL: new RendererGetterWatcherURL(ipcManager),
    });
  }, []);
  const activeScreen = streamer.activeScreen();
  const [openSelector, setOpenSelector] = useState(false);

  const selectScreenHandler: SelectScreen = useCallback((screenID) => {
    setOpenSelector(false);
    streamer.selectScreen(screenID);
  }, [streamer]);

  const cancelStreamHandler = useCallback(() => {
    streamer.reset();
  }, [streamer]);

  const changeScreenHandler = useCallback(() => {
    setOpenSelector(true);
  }, []);
  const cancelSelectScreenHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  return (
    <div className={classes.streamer}>
      {!activeScreen && (
        <StartScreen
          onStart={changeScreenHandler}
          watcherLink={(
            <WatcherLinkPane>
              <WatcherLink size="large" getWatcherURL={streamer.watcher} />
            </WatcherLinkPane>
          )}
        />
      )}
      {activeScreen && (
        <>
          <VideoViewer stream={activeScreen.stream} />
          <ControlPane>
            <Space wrap>
              <WatcherLinkBtn watcherLink={<WatcherLink getWatcherURL={streamer.watcher} />} />
              <ChangeScreenControl onChange={changeScreenHandler} />
              <CancelControl onCancel={cancelStreamHandler} />
            </Space>
          </ControlPane>
        </>
      )}
      <ScreensModal open={openSelector} onCancel={cancelSelectScreenHandler}>
        <Screens
          onSelect={selectScreenHandler}
          getScreens={streamer.getScreens}
        />
      </ScreensModal>
    </div>
  );
}

export default observer(Streamer);
