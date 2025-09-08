import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';

import Header from '.';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('has edx link with logo url', () => {
    const url = 'www.ourLogo.url';
    const baseUrl = 'www.lms.url';
    getConfig.mockReturnValue({ LOGO_URL: url, LMS_BASE_URL: baseUrl });

    render(
      <IntlProvider messages={{}} locale="en">
        <Header />
      </IntlProvider>,
    );

    const link = screen.getByRole('link');
    const logo = screen.getByAltText('edX logo');

    expect(link).toHaveAttribute('href', `${baseUrl}/dashboard`);
    expect(logo).toHaveAttribute('src', url);
  });
});
