import React from 'react';
import { Button } from 'antd';
import classes from './StartScreen.module.scss';
import WatcherLink from '../WatcherLink';
import WatcherLinkPane from './WatcherLinkPane';

type StartScreenProps = {
  onStart(): void
}

function StartScreen(props: StartScreenProps) {
  const { onStart } = props;

  return (
    <div className={classes.container}>
      <Button onClick={onStart} type="primary" size="large">Start broadcasting</Button>
      <WatcherLinkPane className={classes.link}>
        <WatcherLink />
      </WatcherLinkPane>
    </div>
  );
}

export default StartScreen;
