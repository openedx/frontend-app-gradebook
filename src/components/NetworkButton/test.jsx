import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useShouldShowSpinner } from '@src/components/GradesView/data/hooks';
import NetworkButton, { buttonStates } from '.';

jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useShouldShowSpinner: jest.fn(),
}));

const label = {
  id: 'test.button.label',
  defaultMessage: 'Test Button',
  description: 'A test button',
};

describe('NetworkButton', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useShouldShowSpinner.mockReturnValue(false);
  });

  it('renders with an accessible name from the label message', () => {
    renderWithAllProviders(<NetworkButton label={label} onClick={onClick} />);
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });

  it('shows the download icon by default', () => {
    renderWithAllProviders(<NetworkButton label={label} onClick={onClick} />);
    expect(screen.getByRole('button').querySelector('.fa-download')).toBeInTheDocument();
  });

  it('shows the upload icon when import is true', () => {
    renderWithAllProviders(<NetworkButton label={label} onClick={onClick} import />);
    expect(screen.getByRole('button').querySelector('.fa-upload')).toBeInTheDocument();
  });

  it('applies the caller-supplied className plus the base ml-2', () => {
    renderWithAllProviders(<NetworkButton label={label} onClick={onClick} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class', 'ml-2');
  });

  it('invokes onClick when clicked in the default state', async () => {
    renderWithAllProviders(<NetworkButton label={label} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('when the spinner is showing', () => {
    beforeEach(() => {
      useShouldShowSpinner.mockReturnValue(true);
    });

    it('renders the spinner icon', () => {
      renderWithAllProviders(<NetworkButton label={label} onClick={onClick} />);
      expect(screen.getByRole('button').querySelector('.fa-spinner.fa-spin')).toBeInTheDocument();
    });

    it('marks the button as disabled and swallows clicks', async () => {
      renderWithAllProviders(<NetworkButton label={label} onClick={onClick} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('exports the buttonStates dictionary', () => {
    expect(buttonStates.default).toBe('default');
    expect(buttonStates.pending).toBe('pending');
  });
});
