import { Button, Modal } from 'antd';
import React, {
  useCallback, useMemo, useState, memo,
} from 'react';
import Screens from './Screens';
import StreamManager from '../StreamManager';
import IpcManager from '../../../../core/IpcManager';
import RendererSourceCollector from '../../../../core/SourceCollector/RendererSourceCollector';

type ScreenSelectorProps = {
  onSelect(stream: MediaStream): void
  onCancel(): void
  open: boolean
}

function ScreenSelector(props: ScreenSelectorProps) {
  const { onSelect, open, onCancel } = props;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamManager = useMemo(() => new StreamManager(), []);
  const sourceCollector = useMemo(() => new RendererSourceCollector(IpcManager.getInRenderer()), []);

  const okHandler = useCallback(() => {

    if (stream) onSelect(stream);
  }, [onSelect, stream]);

  const selectHandler = useCallback((screenStream: MediaStream) => {
    setStream(screenStream);
  }, []);

  return (
    <Modal
      open={open}
      title="Select the window to broadcast"
      onOk={okHandler}
      onCancel={onCancel}
      width="80%"
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button disabled={stream === null} key="submit" type="primary" onClick={okHandler}>
          Select
        </Button>,
      ]}
    >
      <Screens
        onSelect={selectHandler}
        sourceCollector={sourceCollector}
        streamManager={streamManager}
      />
    </Modal>
  );
}

export default memo(ScreenSelector);
