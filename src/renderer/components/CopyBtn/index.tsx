import { Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import React, { memo, useCallback, useState } from 'react';
import { BaseButtonProps } from 'antd/lib/button/button';

type CopyBtnProps = {
  copyValue: string
} & BaseButtonProps;

/**
 * Button to copy the value to the clipboard.
 */
function CopyBtn(props: CopyBtnProps) {
  const { copyValue, ...rest } = props;

  const [wasCopy, setCopy] = useState(false);
  const clickHandler = useCallback(async () => {
    await navigator.clipboard.writeText(copyValue);
    setCopy(true);

    setTimeout(() => setCopy(false), 3000);
  }, [copyValue]);

  return (
    <Tooltip placement="top" title={wasCopy ? 'Copied!' : 'Copy'}>
      <Button onClick={clickHandler} {...rest} icon={<CopyOutlined />} />
    </Tooltip>
  );
}

export default memo(CopyBtn);
