import React from 'react';
import { mockConfigs } from 'setupTest';
import { initializeMocks, render, waitFor } from 'testUtilsExtra';

import Head from './Head';

jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('react');

describe('Head', () => {
  it('should match render title tag and favicon with the site configuration values', async () => {
    initializeMocks();
    render(<Head />);

    await waitFor(() => {
      expect(document.title).toBe(`Gradebook | ${mockConfigs.SITE_NAME}`);
    });

    const favicon = document.querySelector('link[rel="shortcut icon"]');
    expect(favicon).toBeInTheDocument();
    expect(favicon.href).toBe(mockConfigs.FAVICON_URL);
  });
});
