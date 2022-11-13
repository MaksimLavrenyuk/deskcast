import React, {
  useState, useEffect, memo, useCallback,
} from 'react';
import { Col, Row } from 'antd';
import { SourceCollector } from '../../../../core/SourceCollector/types';
import { StreamManager } from '../StreamManager/types';
import ScreenItem from './ScreenItem';

export type SelectHandler = {
  (video: MediaStream): void
}

type VideoSelectorProps = {
  streamManager: StreamManager
  sourceCollector: SourceCollector
  onSelect: SelectHandler
}

export type Screen = {
  stream: MediaStream,
  name: string
  id: string
}

function Screens(props: VideoSelectorProps) {
  const { onSelect, streamManager, sourceCollector } = props;
  const [screens, setScreens] = useState<Screen[]>([]);

  const [selectedStream, setSelectedStream] = useState<MediaStream | null>(null);

  const selectHandler: SelectHandler = useCallback((stream) => {
    setSelectedStream(stream);
    onSelect(stream);
  }, [onSelect]);

  useEffect(() => {
    (async () => {
      const sourcesList = await sourceCollector.sources();
      const streams = await Promise.all(sourcesList.map((source) => streamManager.getStream(source.id)));

      setScreens(streams.map((stream, index) => ({
        stream,
        name: sourcesList[index].name,
        id: sourcesList[index].id,
      })));
    })();
  }, [sourceCollector, streamManager]);

  return (
    <Row gutter={[15, 15]}>
      {screens.map((screen) => (
        <Col span={6} key={screen.id}>
          <ScreenItem
            onSelect={selectHandler}
            isSelect={selectedStream === screen.stream}
            stream={screen.stream}
            name={screen.name}
          />
        </Col>
      ))}
    </Row>
  );
}

export default memo(Screens);
