import React from 'react';
import { Button } from 'antd';
import classes from './StartScreen.module.scss';
import WatcherLinkPane from './WatcherLinkPane';

type StartScreenProps = {
  onStart(): void
  watcherLink: React.ReactNode,
}

function StartScreen(props: StartScreenProps) {
  const { onStart, watcherLink } = props;

  return (
    <div className={classes.container}>
      <Button onClick={onStart} type="primary" size="large">Start broadcasting</Button>
      <WatcherLinkPane className={classes.link}>
        {watcherLink}
      </WatcherLinkPane>
    </div>
  );
}

export default React.memo(StartScreen);
