import React from 'react';
import { render, screen } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';

import Header from '.';

jest.unmock('@openedx/paragon');

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('Header', () => {
  test('has edx link with logo url', () => {
    const url = 'www.ourLogo.url';
    const baseUrl = 'www.lms.url';
    getConfig.mockReturnValue({ LOGO_URL: url, LMS_BASE_URL: baseUrl });

    render(<Header />);
    expect(screen.getByRole('link')).toHaveAttribute('href', `${baseUrl}/dashboard`);
    expect(screen.getByAltText('edX logo')).toHaveAttribute('src', url);
  });
});
