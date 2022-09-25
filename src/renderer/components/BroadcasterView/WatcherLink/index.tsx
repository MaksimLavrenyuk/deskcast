import React, {
  memo, useState, useEffect, useMemo,
} from 'react';
import { Typography, Skeleton, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import classes from './WatcherLink.module.scss';
import WatcherLinkGetter from './WatcherLinkGetter';
import IpcRendererManager from '../../../../utils/IpcManager/IpcRendererManager';
import CopyBtn from '../../CopyBtn';

type WatcherLinkProps = {
  className?: string
}

function WatcherLink(props: WatcherLinkProps) {
  const {
    className = '',
  } = props;

  const linkGetter = useMemo(() => new WatcherLinkGetter(IpcRendererManager.get()), []);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const watcherLink = await linkGetter.link();

      setLoading(false);
      setLink(watcherLink);
    })();
  }, [linkGetter]);

  return (
    <div className={`${classes.container} ${className}`}>
      <Typography.Title level={5}>Broadcast link</Typography.Title>
      {!loading && link && (
        <div className={classes.link_container}>
          <div className={classes.link}>{link}</div>
          <CopyBtn copyValue={link} size="large" />
        </div>
      )}
      {loading && !link && (
        <Skeleton loading={loading} active />
      )}
    </div>
  );
}

export default memo(WatcherLink);
