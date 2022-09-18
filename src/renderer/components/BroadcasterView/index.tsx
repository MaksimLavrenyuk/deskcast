import React, {
  useCallback, useMemo, memo, useState,
} from 'react';
import VideoSelector, { SelectHandler } from './VideoSelector';
import VideoViewer from './VideoViewer';
import Broadcaster from '../../../core/Broadcaster';
import Sender from '../../../core/Broadcaster/Sender';
import StreamManager from './StreamManager';
import RendererCapturer from '../../../core/SourceCollector/RendererCapturer';
import IpcRendererManager from '../../../utils/IpcManager/IpcRendererManager';

function BroadcasterView() {
  const [video, setVideo] = useState<MediaStream | null>(null);
  const streamManager = useMemo(() => new StreamManager(), []);
  const sourceCollector = useMemo(() => new RendererCapturer(IpcRendererManager.get()), []);
  const broadcaster = useMemo(() => new Broadcaster({ connectionManager: new Sender() }), []);
  console.log('BroadcasterView');

  const selectHandler: SelectHandler = useCallback((stream) => {
    setVideo(stream);
    console.log('attachStream');
    broadcaster.attachStream(stream);
  }, [broadcaster]);

  return (
    <>
      <VideoViewer video={video} />
      <VideoSelector
        onSelect={selectHandler}
        streamManager={streamManager}
        sourceCollector={sourceCollector}
      />
    </>
  );
}

export default memo(BroadcasterView);
