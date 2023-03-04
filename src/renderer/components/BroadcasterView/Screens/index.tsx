import React from 'react';
import { Col, Row } from 'antd';
import { observer } from 'mobx-react';
import ScreenItem from './Screen';
import { SelectScreen, GetScreens } from '../BroadcasterView';

type ScreensProps = {
  getScreens: GetScreens
  onSelect: SelectScreen
}

function Screens(props: ScreensProps) {
  const { onSelect, getScreens } = props;

  return (
    <Row gutter={[15, 15]}>
      {getScreens().map((screen) => (
        <Col span={6} key={screen.id}>
          <ScreenItem
            onSelect={onSelect}
            screen={screen}
          />
        </Col>
      ))}
    </Row>
  );
}

export default observer(Screens);
