import React from 'react';
import { Button } from 'antd';
import classes from './Starter.module.scss';

type StarterProps = {
  onStart(): void
  watcherLink: React.ReactNode,
}

function Starter(props: StarterProps) {
  const { onStart, watcherLink } = props;

  return (
    <div className={classes.container}>
      <Button onClick={onStart} type="primary" size="large">Start broadcasting</Button>
      <div className={classes.link}>
        {watcherLink}
      </div>
    </div>
  );
}

export default React.memo(Starter);
