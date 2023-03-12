import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Starter from './index';

test('The callback-start should be triggered when the start button is pressed', async () => {
  const user = userEvent.setup();
  const startHandler = jest.fn();

  render((
    <Starter onStart={startHandler} watcherLink={<span>https://example.com</span>} />
  ));

  await user.click(
    screen.getByText(/start/i),
  );

  expect(startHandler).toBeCalled();
});
