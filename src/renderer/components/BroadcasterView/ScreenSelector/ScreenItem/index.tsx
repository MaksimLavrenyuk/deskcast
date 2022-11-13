import React, {
  memo, useEffect, useRef, useCallback,
} from 'react';
import { Card } from 'antd';
import classes from './ScreenItem.module.less';
import { SelectHandler } from '../Screens';

type ScreenItemProps = {
  stream: MediaStream
  name: string
  onSelect: SelectHandler
  isSelect: boolean
}

function ScreenItem(props: ScreenItemProps) {
  const {
    stream, name, onSelect, isSelect,
  } = props;
  const $videoRef = useRef<HTMLVideoElement>(null);

  const clickHandler = useCallback(() => {
    onSelect(stream);
  }, [onSelect, stream]);

  useEffect(() => {
    $videoRef.current.srcObject = stream;
    $videoRef.current.autoplay = true;
    $videoRef.current.playsInline = true;
  }, [stream]);

  return (
    <Card
      bordered
      className={isSelect && classes.select}
      onClick={clickHandler}
      hoverable
      cover={<video ref={$videoRef} />}
    >
      <Card.Meta title={name} />
    </Card>
  );
}

export default memo(ScreenItem);
