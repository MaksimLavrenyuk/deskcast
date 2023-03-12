import { Button, Popconfirm, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';

type CancelControlProps = {
  onCancel(): void
}

function CancelControl(props: CancelControlProps) {
  const { onCancel } = props;

  return (
    <Popconfirm
      placement="top"
      title="Are you sure you want to end the broadcast?"
      onConfirm={onCancel}
      okText="Yes"
      cancelText="No"
    >
      <Tooltip placement="top" title="Finish the broadcast">
        <Button
          type="text"
          size="large"
          danger
          icon={<CloseOutlined />}
        />
      </Tooltip>
    </Popconfirm>
  );
}

export default React.memo(CancelControl);
