import React from 'react';
import { Skeleton } from 'antd';
import { observer } from 'mobx-react';
import classes from './WatcherLink.module.less';
import CopyBtn from '../../CopyBtn';
import { GetWatcherURL } from '../BroadcasterView';

type WatcherLinkProps = {
  getWatcherURL: GetWatcherURL
}

function WatcherLink(props: WatcherLinkProps) {
  const { getWatcherURL } = props;
  const url = getWatcherURL();

  return (
    <>
      {url && (
        <div className={classes.link_container}>
          <div className={classes.link}>{url}</div>
          <CopyBtn copyValue={url} size="large" />
        </div>
      )}
      {!url && (
        <Skeleton loading active />
      )}
    </>
  );
}

export default observer(WatcherLink);
