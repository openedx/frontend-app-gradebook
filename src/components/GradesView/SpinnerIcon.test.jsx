import React from 'react';
import { render } from '@testing-library/react';

import { selectors } from 'data/redux/hooks';
import SpinnerIcon from './SpinnerIcon';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');
jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: { useShouldShowSpinner: jest.fn() },
  },
}));

describe('SpinnerIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('does not render if show: false', () => {
    selectors.root.useShouldShowSpinner.mockReturnValueOnce(false);
    const { container } = render(<SpinnerIcon />);
    expect(container.querySelector('.fa.fa-spinner')).not.toBeInTheDocument();
  });

  test('displays spinner overlay with spinner icon', () => {
    selectors.root.useShouldShowSpinner.mockReturnValueOnce(true);
    const { container } = render(<SpinnerIcon />);
    expect(container.querySelector('.fa.fa-spinner')).toBeInTheDocument();
  });
});
