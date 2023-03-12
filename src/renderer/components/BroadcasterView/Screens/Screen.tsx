import React, {
  memo, useCallback, useEffect, useRef,
} from 'react';
import { Card } from 'antd';
import { Screen } from '../BroadcacterViewStore';

type ScreenItemProps = {
  onSelect(screenID: string): void
  screen: Screen
}

function Screen(props: ScreenItemProps) {
  const {
    onSelect, screen,
  } = props;
  const $videoRef = useRef<HTMLVideoElement>(null);

  const selectScreen = useCallback(() => {
    onSelect(screen.id);
  }, [onSelect, screen.id]);

  useEffect(() => {
    $videoRef.current.srcObject = screen.stream;
    $videoRef.current.autoplay = true;
    $videoRef.current.playsInline = true;
  }, [screen.stream]);

  return (
    <Card
      bordered
      onClick={selectScreen}
      hoverable
      cover={<video ref={$videoRef} />}
    >
      <Card.Meta title={screen.name} />
    </Card>
  );
}

export default memo(Screen);
