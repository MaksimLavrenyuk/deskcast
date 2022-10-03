import React from 'react';
import { Button } from 'antd';
import classes from './StartScreen.module.scss';
import WatcherLink from '../WatcherLink';

type StartScreenProps = {
  onStart(): void
}

function StartScreen(props: StartScreenProps) {
  const { onStart } = props;

  return (
    <div className={classes.container}>
      <Button onClick={onStart} type="primary" size="large">Start broadcasting</Button>
      <WatcherLink className={classes.link} />
    </div>
  );
}

export default StartScreen;
