import React, { useState, useEffect, memo } from 'react';
import { SourceCollector, Source } from '../../../../core/SourceCollector/types';
import { StreamManager } from '../StreamManager/types';

export type SelectHandler = {
  (video: MediaStream): void
}

type VideoSelectorProps = {
  streamManager: StreamManager
  sourceCollector: SourceCollector
  onSelect: SelectHandler
}

function VideoSelector(props: VideoSelectorProps) {
  const { onSelect, streamManager, sourceCollector } = props;
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    (async () => {
      const sourcesList = await sourceCollector.sources();
      setSources(sourcesList);
    })();
  });

  const selectHandler: React.ReactEventHandler<HTMLSelectElement> = async (event) => {
    console.log('fvfvfv');
    const video = await streamManager.getStream(event.currentTarget.value);

    if (video) onSelect(video);
  };

  return (
    <select onChange={selectHandler}>
      {sources.map((source) => (
        <option key={source.id} value={source.id}>{source.name}</option>
      ))}
    </select>
  );
}

export default memo(VideoSelector);
