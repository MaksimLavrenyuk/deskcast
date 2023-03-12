import { Card } from 'antd';
import React, { ReactNode, memo } from 'react';

type WatcherLinkPaneProps = {
  className?: string
  children: ReactNode
}

function WatcherLinkPane(props: WatcherLinkPaneProps) {
  const { className = '', children } = props;

  return (
    <Card className={className} title="Broadcast link">
      {children}
    </Card>
  );
}

export default memo(WatcherLinkPane);
