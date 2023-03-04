import { Button, Modal } from 'antd';
import React, { memo, ReactNode } from 'react';

type ScreensModalProps = {
  onCancel(): void
  children: ReactNode
  open: boolean
}

function ScreensModal(props: ScreensModalProps) {
  const { open, onCancel, children } = props;

  return (
    <Modal
      open={open}
      title="Select the window to broadcast"
      onCancel={onCancel}
      width="80%"
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
}

export default memo(ScreensModal);
