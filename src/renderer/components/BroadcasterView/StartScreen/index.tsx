import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import classes from './StartScreen.module.scss';
import WatcherLink from '../WatcherLink';
import VideoSelector, { SelectHandler } from '../VideoSelector';
import StreamManager from '../StreamManager';
import RendererCapturer from '../RendererCapturer';
import IpcRendererManager from '../../../../utils/IpcManager/IpcRendererManager';

type StartScreenProps = {
  onSelectScreen: SelectHandler
}

function StartScreen(props: StartScreenProps) {
  const { onSelectScreen } = props;

  const [openSelector, setOpenSelector] = useState(false);
  const streamManager = useMemo(() => new StreamManager(), []);
  const sourceCollector = useMemo(() => new RendererCapturer(IpcRendererManager.get()), []);

  const clickHandler = useCallback(() => {
    setOpenSelector(true);
  }, []);

  const okHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  const cancelHandler = useCallback(() => {
    setOpenSelector(false);
  }, []);

  return (
    <>
      <div className={classes.container}>
        <Button onClick={clickHandler} type="primary" size="large">Start broadcasting</Button>
        <WatcherLink className={classes.link} />
      </div>
      <Modal
        open={openSelector}
        title="Select the window to broadcast"
        onOk={okHandler}
        onCancel={cancelHandler}
        footer={[
          <Button key="back" onClick={cancelHandler}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={okHandler}>
            Select
          </Button>,
        ]}
      >
        <VideoSelector
          onSelect={(video) => console.log(video)}
          sourceCollector={sourceCollector}
          streamManager={streamManager}
        />
      </Modal>
    </>
  );
}

export default StartScreen;
