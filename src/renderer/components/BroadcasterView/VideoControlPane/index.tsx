import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import { Button, Tooltip, Popconfirm } from 'antd';
import { debounce } from 'lodash';
import { SelectOutlined, CloseOutlined } from '@ant-design/icons';
import classes from './VideoControlPane.module.less';
import BroadcastLinkBtn from './BroadcastLinkBtn';

type VideoControlPaneProps = {
  requestChangeScreen(): void
  onCancelStream(): void
  className?: string
}

function moveMouseHandler(
  onMove: () => void,
  onStop: () => void,
) {
  let timeoutID: null | number = null;

  const mouseMoveHandler = debounce(() => {
    if (timeoutID) {
      onMove();
      clearTimeout(timeoutID);
      timeoutID = 0;
    }

    timeoutID = window.setTimeout(onStop, 2000);
  }, 50);

  window.addEventListener('mousemove', mouseMoveHandler);

  return () => {
    window.removeEventListener('mousemove', mouseMoveHandler);
  };
}

function VideoControlPane(props: VideoControlPaneProps) {
  const { className, requestChangeScreen, onCancelStream } = props;

  const [show, toggle] = useState(true);

  const moveCursorHandler = useCallback(() => {
    toggle(true);
  }, []);
  const stopCursorHandler = useCallback(() => {
    toggle(false);
  }, []);

  useEffect(() => {
    const handle = moveMouseHandler(moveCursorHandler, stopCursorHandler);

    return () => {
      handle();
    };
  }, [moveCursorHandler, stopCursorHandler]);

  return (
    <div className={`${classes.pane} ${className} ${show ? `animate__slideInUp ${classes.show}` : `animate__slideOutDown ${classes.hidden}`}`}>
      <BroadcastLinkBtn className={classes.btnSpace} />
      <Tooltip placement="top" title="Select another screen">
        <Button
          className={classes.btnSpace}
          onClick={requestChangeScreen}
          type="primary"
          shape="circle"
          icon={<SelectOutlined />}
          size="large"
        />
      </Tooltip>
      <Popconfirm placement="top" title="Are you sure you want to end the broadcast?" onConfirm={onCancelStream} okText="Yes" cancelText="No">
        <Tooltip placement="top" title="Finish the broadcast">
          <Button
            onClick={onCancelStream}
            danger
            type="primary"
            shape="circle"
            icon={<CloseOutlined />}
            size="large"
          />
        </Tooltip>
      </Popconfirm>
    </div>
  );
}

export default memo(VideoControlPane);
