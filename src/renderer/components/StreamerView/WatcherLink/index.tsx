import React from 'react';
import {
  Input, Space, Button,
} from 'antd';
import { observer } from 'mobx-react';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import CopyBtn from '../../CopyBtn';
import { GetWatcherURL } from '../StreamerViewStore';

type WatcherLinkProps = {
  size?: SizeType
  getWatcherURL: GetWatcherURL
}

function WatcherLink(props: WatcherLinkProps) {
  const { getWatcherURL, size } = props;
  const url = getWatcherURL();

  return (
    <Space>
      <Input disabled={url === null} size={size} style={{ width: '100%' }} value={url} />
      {url === null && <Button loading size={size} />}
      {url && <CopyBtn size={size} copyValue={url} />}
    </Space>
  );
}

export default observer(WatcherLink);
