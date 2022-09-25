import React from 'react';
import { Button } from 'antd';
import classes from './StartScreen.module.scss';
import WatcherLink from '../WatcherLink';

type StartScreenProps = {

}

function StartScreen(props: StartScreenProps) {
  return (
    <div className={classes.container}>
      <Button type="primary" size="large">Start broadcasting</Button>
      <WatcherLink className={classes.link} />
    </div>
  );
}

export default StartScreen;
