import { render } from '@testing-library/react';

import { useShouldShowSpinner } from './data/hooks';
import SpinnerIcon from './SpinnerIcon';

jest.mock('./data/hooks', () => ({
  useShouldShowSpinner: jest.fn(),
}));

describe('SpinnerIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if show: false', () => {
    useShouldShowSpinner.mockReturnValueOnce(false);
    const { container } = render(<SpinnerIcon />);
    expect(container.querySelector('.fa.fa-spinner')).not.toBeInTheDocument();
  });

  it('displays spinner overlay with spinner icon', () => {
    useShouldShowSpinner.mockReturnValueOnce(true);
    const { container } = render(<SpinnerIcon />);
    expect(container.querySelector('.fa.fa-spinner')).toBeInTheDocument();
  });
});
