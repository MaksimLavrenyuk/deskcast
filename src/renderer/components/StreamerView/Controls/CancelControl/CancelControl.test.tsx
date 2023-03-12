import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CancelControl from './index';

test('Clicked the button, a warning was displayed, agreed, called onCancel', async () => {
  const user = userEvent.setup();
  const cancelHandler = jest.fn();

  render((
    <CancelControl onCancel={cancelHandler} />
  ));

  await user.click(
    screen.getByRole('button'),
  );

  expect(cancelHandler).not.toBeCalled();

  await user.click(
    screen.getByText('Yes'),
  );

  expect(cancelHandler).toBeCalled();
});
