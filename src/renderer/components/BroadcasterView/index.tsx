import React, {
  useCallback, useMemo, memo, useState,
} from 'react';
import { SelectHandler } from './ScreenSelector/Screens';
import VideoViewer from './VideoViewer';
import Broadcaster from '../../../core/RTCConnectionManager/Broadcaster';
import SocketSender from '../../../core/RTCConnectionManager/Sender/SocketSender';
import StartScreen from './StartScreen';
import VideoControlPane from './VideoControlPane';
import ScreenSelector from './ScreenSelector';
import classes from './BroadcasterView.module.scss';

function BroadcasterView() {
  const [video, setVideo] = useState<MediaStream | null>(null);
  const [openSelector, setOpenSelector] = useState(false);
  const broadcaster = useMemo(() => new Broadcaster({ sender: new SocketSender('ws://localhost:4002') }), []);

  const selectHandler: SelectHandler = useCallback((stream) => {
    setVideo(stream);
    setOpenSelector(false);
    broadcaster.attachStream(stream);
  }, [broadcaster]);
  const cancelStreamHandler = useCallback(() => {
    setVideo(null);
    broadcaster.cancelStream();
  }, [broadcaster]);

  const selectScreenRequestHandler = useCallback(() => {
    setOpenSelector(true);
  }, []);
  const cancelSelectScreenHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  return (
    <div className={classes.broadcaster}>
      {!video && (
        <StartScreen onStart={selectScreenRequestHandler} />
      )}
      {video && (
        <>
          <VideoViewer video={video} />
          <VideoControlPane
            className={classes.controlPane}
            requestChangeScreen={selectScreenRequestHandler}
            onCancelStream={cancelStreamHandler}
          />
        </>
      )}
      <ScreenSelector
        open={openSelector}
        onCancel={cancelSelectScreenHandler}
        onSelect={selectHandler}
      />
    </div>
  );
}

export default memo(BroadcasterView);
