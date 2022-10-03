import { Typography } from 'antd';
import React, { ReactNode, memo } from 'react';
import classes from './WatcherLinkPane.module.scss';

type WatcherLinkPaneProps = {
  className?: string
  children: ReactNode
}

function WatcherLinkPane(props: WatcherLinkPaneProps) {
  const { className = '', children } = props;

  return (
    <div className={`${classes.pane} ${className}`}>
      <Typography.Title level={5}>Broadcast link</Typography.Title>
      {children}
    </div>
  );
}

export default memo(WatcherLinkPane);
