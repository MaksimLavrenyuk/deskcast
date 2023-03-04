import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import {
  Button, Tooltip, Popconfirm, FloatButton,
} from 'antd';
import { throttle } from 'lodash';
import { SelectOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import classes from './VideoControlPane.module.less';
import BroadcastLinkBtn from './BroadcastLinkBtn';

type VideoControlPaneProps = {
  requestChangeScreen(): void
  onCancelStream(): void
  className?: string
  watcherLink: React.ReactNode,
}

function moveMouseHandler(
  onMove: () => void,
  onStop: () => void,
) {
  let timeoutID: null | number = null;

  const mouseMoveHandler = throttle(() => {
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

function ControlPane(props: VideoControlPaneProps) {
  const {
    className, requestChangeScreen, onCancelStream, watcherLink,
  } = props;

  const [show, toggle] = useState(true);

  const moveCursorHandler = useCallback(() => {
    toggle(true);
  }, []);
  const stopCursorHandler = useCallback(() => {
    toggle(false);
  }, []);

  useEffect(() => {
    const dispose = moveMouseHandler(moveCursorHandler, stopCursorHandler);

    return () => {
      dispose();
    };
  }, [moveCursorHandler, stopCursorHandler]);

  return (
    <>
      <FloatButton.Group
        type="primary"
        shape="square"
        style={{ top: 20, right: 20 }}
        className={`${classes.pane} ${className} ${show ? `animate__slideInUp ${classes.show}` : `animate__slideOutDown ${classes.hidden}`}`}
      >
        <FloatButton tooltip="Link to the broadcast" icon={<LinkOutlined />} />
        <FloatButton tooltip="Select another screen" icon={<SelectOutlined />} />
        <FloatButton tooltip="Finish the broadcast" icon={<CloseOutlined />} />
      </FloatButton.Group>

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
    </>
  );
}

export default memo(ControlPane);
