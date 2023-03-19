import { Button, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import React from 'react';

type ChangeScreenControlProps = {
  onChange(): void
}

function ChangeScreenControl(props: ChangeScreenControlProps) {
  const { onChange } = props;

  return (
    <Tooltip placement="top" title="Select another screen">
      <Button
        type="text"
        size="large"
        onClick={onChange}
        icon={<SelectOutlined />}
      />
    </Tooltip>
  );
}

export default React.memo(ChangeScreenControl);
