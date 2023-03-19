import React, {
  ReactNode, useCallback, useEffect, useState, memo,
} from 'react';
import throttle from 'lodash/throttle';
import classes from './ControlPane.module.scss';

type ControlPaneProps = {
  className?: string
  children: ReactNode
}

function moveMouseHandler(
  onMove: () => void,
  onStop: () => void,
) {
  let timeoutID: ReturnType<typeof setTimeout> = null;

  const mouseMoveHandler = throttle(() => {
    if (timeoutID) {
      onMove();
      clearTimeout(timeoutID);
      timeoutID = null;
    }

    timeoutID = setTimeout(onStop, 2000);
  }, 100);

  window.addEventListener('mousemove', mouseMoveHandler);

  return () => {
    window.removeEventListener('mousemove', mouseMoveHandler);
  };
}

function ControlPane(props: ControlPaneProps) {
  const { className = '', children } = props;

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
    <div data-testid="control-pane" className={`${classes.pane} ${className} ${show ? `animate__slideInUp ${classes.show}` : `animate__slideOutDown ${classes.hidden}`}`}>
      {children}
    </div>
  );
}

export default memo(ControlPane);
