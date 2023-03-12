import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import React from 'react';
import ControlPane from './index';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('The panel should show/hide when the mouse is moved', async () => {
  render((
    <ControlPane>
      <span />
    </ControlPane>
  ));

  // Initially the panel is shown
  let pane = screen.getByTestId('control-pane');
  expect(pane.classList.contains('show')).toBeTruthy();
  expect(pane.classList.contains('hidden')).toBeFalsy();

  // Move the mouse - after a while the panel should be hidden
  fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  pane = screen.getByTestId('control-pane');
  expect(pane.classList.contains('show')).toBeFalsy();
  expect(pane.classList.contains('hidden')).toBeTruthy();

  // moved the mouse again - the panel appeared
  fireEvent.mouseMove(window, { clientX: 10, clientY: 20 });
  // act(() => {
  //   jest.runAllTimers();
  // });
  //
  pane = screen.getByTestId('control-pane');
  expect(pane.classList.contains('show')).toBeTruthy();
  expect(pane.classList.contains('hidden')).toBeFalsy();

  // Stop moving the mouse - after a while the panel disappeared again
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  pane = screen.getByTestId('control-pane');
  expect(pane.classList.contains('show')).toBeFalsy();
  expect(pane.classList.contains('hidden')).toBeTruthy();
});
