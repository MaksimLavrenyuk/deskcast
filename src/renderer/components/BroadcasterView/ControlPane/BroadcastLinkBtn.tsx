import { Button, Modal, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import React, { memo, useCallback, useState } from 'react';

type BroadcastLinkBtnProps = {
  className?: string
  watcherLink: React.ReactNode,
}

function BroadcastLinkBtn(props: BroadcastLinkBtnProps) {
  const { className = '', watcherLink } = props;
  const [openLinkModal, toggleLinkModal] = useState(false);

  const closeModalHandler = useCallback(() => {
    toggleLinkModal(false);
  }, []);
  const clickHandler = useCallback(() => {
    toggleLinkModal(true);
  }, []);

  return (
    <>
      <Tooltip placement="top" title="Link to the broadcast">
        <Button
          className={className}
          onClick={clickHandler}
          type="primary"
          shape="circle"
          icon={<LinkOutlined />}
          size="large"
        />
      </Tooltip>
      <Modal
        open={openLinkModal}
        title="Broadcast link"
        onCancel={closeModalHandler}
        width="80%"
        centered
        footer={[
          <Button key="back" onClick={closeModalHandler}>
            Close
          </Button>,
        ]}
      >
        {watcherLink}
      </Modal>
    </>
  );
}

export default memo(BroadcastLinkBtn);
