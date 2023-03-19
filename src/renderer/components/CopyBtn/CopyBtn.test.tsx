import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyBtn from './index';

test('When you click the button, should copy the specified value to the clipboard', async () => {
  const copyValue = 'test';
  const user = userEvent.setup();

  render((
    <CopyBtn copyValue={copyValue} />
  ));

  await user.click(
    screen.getByRole('button'),
  );

  const clipboardItems = await navigator.clipboard.read();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(await clipboardItems[0].data['text/plain']).toBe(copyValue);
});
