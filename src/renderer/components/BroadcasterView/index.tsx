import React, {
  useCallback, useMemo, memo, useState,
} from 'react';
import { SelectHandler } from './VideoSelector';
import VideoViewer from './VideoViewer';
import Broadcaster from '../../../core/RTCConnectionManager/Broadcaster';
import SocketSender from '../../../core/RTCConnectionManager/Sender/SocketSender';
import StartScreen from './StartScreen';

function BroadcasterView() {
  const [video, setVideo] = useState<MediaStream | null>(null);
  const broadcaster = useMemo(() => new Broadcaster({ sender: new SocketSender('ws://localhost:4002') }), []);

  const selectHandler: SelectHandler = useCallback((stream) => {
    setVideo(stream);
    console.log('attachStream');
    broadcaster.attachStream(stream);
  }, [broadcaster]);

  return (
    <>
      {!video && (
        <StartScreen onSelectScreen={selectHandler} />
      )}
      {video && (
        <>
          <VideoViewer video={video} />
          {/* <VideoSelector */}
          {/*   onSelect={selectHandler} */}
          {/*   streamManager={streamManager} */}
          {/*   sourceCollector={sourceCollector} */}
          {/* /> */}
        </>
      )}
    </>
  );
}

export default memo(BroadcasterView);
