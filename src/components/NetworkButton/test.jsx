import React from 'react';

import { render, screen, initializeMocks } from 'testUtilsExtra';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';

import { NetworkButton, mapStateToProps, buttonStates } from '.';

jest.mock('data/selectors', () => ({
  root: {
    shouldShowSpinner: jest.fn(),
  },
}));

const selectors = require('data/selectors');

initializeMocks();

describe('NetworkButton', () => {
  const defaultProps = {
    label: {
      id: 'test.button.label',
      defaultMessage: 'Test Button',
      description: 'A test button',
    },
    onClick: jest.fn(),
    className: '',
    showSpinner: false,
    import: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    render(<NetworkButton {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /test button/i }),
    ).toBeInTheDocument();
  });

  it('renders button with download icon by default', () => {
    render(<NetworkButton {...defaultProps} />);

    const button = screen.getByRole('button');
    const icon = button.querySelector('.fa-download');
    expect(icon).toBeInTheDocument();
  });

  it('renders button with upload icon when import is true', () => {
    const props = {
      ...defaultProps,
      import: true,
    };
    render(<NetworkButton {...props} />);

    const button = screen.getByRole('button');
    const icon = button.querySelector('.fa-upload');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const props = {
      ...defaultProps,
      className: 'custom-class',
    };
    render(<NetworkButton {...props} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class', 'ml-2');
  });

  it('applies default margin class', () => {
    render(<NetworkButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ml-2');
  });

  it('calls onClick when button is clicked', async () => {
    const onClick = jest.fn();
    const props = {
      ...defaultProps,
      onClick,
    };
    render(<NetworkButton {...props} />);
    const user = userEvent.setup();

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('spinner state', () => {
    it('shows spinner icon when showSpinner is true', () => {
      const props = {
        ...defaultProps,
        showSpinner: true,
      };
      render(<NetworkButton {...props} />);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('.fa-spinner.fa-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('disables button when showSpinner is true', () => {
      const props = {
        ...defaultProps,
        showSpinner: true,
      };
      render(<NetworkButton {...props} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onClick when button is disabled and clicked', async () => {
      const onClick = jest.fn();
      const props = {
        ...defaultProps,
        onClick,
        showSpinner: true,
      };
      render(<NetworkButton {...props} />);
      const user = userEvent.setup();

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('enables button when showSpinner is false', () => {
      render(<NetworkButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });
  });

  describe('button states', () => {
    it('uses default state when showSpinner is false', () => {
      const component = new NetworkButton(defaultProps);

      expect(component.buttonState).toBe(buttonStates.default);
    });

    it('uses pending state when showSpinner is true', () => {
      const props = {
        ...defaultProps,
        showSpinner: true,
      };
      const component = new NetworkButton(props);

      expect(component.buttonState).toBe(buttonStates.pending);
    });
  });

  describe('computed properties', () => {
    it('generates correct labels object', () => {
      const component = new NetworkButton(defaultProps);
      const { labels } = component;

      expect(labels.default).toBeDefined();
      expect(labels.pending).toBeDefined();
    });

    it('generates correct icons for download button', () => {
      const component = new NetworkButton(defaultProps);
      const { icons } = component;

      expect(icons.default).toBeDefined();
      expect(icons.pending).toBeDefined();
    });

    it('generates correct icons for import button', () => {
      const props = {
        ...defaultProps,
        import: true,
      };
      const component = new NetworkButton(props);
      const { icons } = component;

      expect(icons.default).toBeDefined();
      expect(icons.pending).toBeDefined();
    });
  });

  describe('accessibility', () => {
    it('has accessible button role', () => {
      render(<NetworkButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has accessible name from label', () => {
      render(<NetworkButton {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /test button/i }),
      ).toBeInTheDocument();
    });

    it('indicates disabled state to screen readers', () => {
      const props = {
        ...defaultProps,
        showSpinner: true,
      };
      render(<NetworkButton {...props} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('visual states', () => {
    it('has outline-primary variant styling', () => {
      render(<NetworkButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-outline-primary');
    });

    it('shows different visual states based on spinner', () => {
      const { rerender } = render(<NetworkButton {...defaultProps} />);

      let button = screen.getByRole('button');
      expect(button).toBeEnabled();
      expect(button.querySelector('.fa-download')).toBeInTheDocument();

      rerender(<NetworkButton {...defaultProps} showSpinner />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button.querySelector('.fa-spinner')).toBeInTheDocument();
    });
  });

  describe('component interaction', () => {
    it('maintains label text in both states', () => {
      const { rerender } = render(<NetworkButton {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /test button/i }),
      ).toBeInTheDocument();

      rerender(<NetworkButton {...defaultProps} showSpinner />);
      expect(
        screen.getByRole('button', { name: /test button/i }),
      ).toBeInTheDocument();
    });

    it('changes icon but maintains functionality', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <NetworkButton {...defaultProps} onClick={onClick} />,
      );

      let button = screen.getByRole('button');
      expect(button.querySelector('.fa-download')).toBeInTheDocument();
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);

      onClick.mockClear();
      rerender(<NetworkButton {...defaultProps} onClick={onClick} import />);
      button = screen.getByRole('button');
      expect(button.querySelector('.fa-upload')).toBeInTheDocument();
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapStateToProps', () => {
    it('maps showSpinner from state', () => {
      const mockState = { app: { network: { showSpinner: true } } };
      selectors.root.shouldShowSpinner.mockReturnValue(true);

      const result = mapStateToProps(mockState);

      expect(selectors.root.shouldShowSpinner).toHaveBeenCalledWith(mockState);
      expect(result).toEqual({
        showSpinner: true,
      });
    });
  });

  describe('default props', () => {
    it('has correct default className', () => {
      expect(NetworkButton.defaultProps.className).toBe('');
    });

    it('has correct default showSpinner', () => {
      expect(NetworkButton.defaultProps.showSpinner).toBe(false);
    });

    it('has correct default import', () => {
      expect(NetworkButton.defaultProps.import).toBe(false);
    });
  });
});
