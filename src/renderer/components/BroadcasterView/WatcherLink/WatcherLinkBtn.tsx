import React, { memo, ReactNode } from 'react';
import { Button, Popover, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

type WatcherLinkBtnProps = {
  watcherLink: ReactNode
}

function WatcherLinkBtn(props: WatcherLinkBtnProps) {
  const { watcherLink } = props;

  return (
    <Popover
      content={watcherLink}
      title="Broadcast link"
      trigger="click"
    >
      <Tooltip placement="top" title="Link to the broadcast">
        <Button
          size="large"
          type="text"
          icon={<LinkOutlined />}
        />
      </Tooltip>
    </Popover>
  );
}

export default memo(WatcherLinkBtn);
