import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangeScreenControl from './index';

test('The screen change control should have an explanation, when clicked it should tell you about the change request', async () => {
  const user = userEvent.setup();
  const changeHandler = jest.fn();

  render((
    <ChangeScreenControl onChange={changeHandler} />
  ));

  await user.click(
    screen.getByRole('button'),
  );

  expect(changeHandler).toBeCalledTimes(1);
});
