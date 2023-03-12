import { render, screen } from '@testing-library/react';
import React from 'react';
import WatcherLink from './index';

test('Should display the section with the link and the copy button', async () => {
  const url = 'https://example.com';

  render((
    <WatcherLink getWatcherURL={() => url} />
  ));

  screen.getByDisplayValue(url);
});
