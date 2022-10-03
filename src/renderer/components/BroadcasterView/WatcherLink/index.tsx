import React, {
  memo, useState, useEffect, useMemo,
} from 'react';
import { Skeleton } from 'antd';
import classes from './WatcherLink.module.less';
import WatcherLinkGetter from './WatcherLinkGetter';
import IpcRendererManager from '../../../../utils/IpcManager/IpcRendererManager';
import CopyBtn from '../../CopyBtn';

function WatcherLink() {
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
    <>
      {!loading && link && (
        <div className={classes.link_container}>
          <div className={classes.link}>{link}</div>
          <CopyBtn copyValue={link} size="large" />
        </div>
      )}
      {loading && !link && (
        <Skeleton loading={loading} active />
      )}
    </>
  );
}

export default memo(WatcherLink);
