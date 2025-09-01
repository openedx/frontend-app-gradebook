import React from 'react';

import { render, screen, initializeMocks } from 'testUtilsExtra';
import userEvent from '@testing-library/user-event';

import { ScoreViewInput } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: {
      useToggleGradeFormat: jest.fn(),
    },
  },
  selectors: {
    grades: {
      useGradeData: jest.fn(),
    },
  },
}));

const { actions, selectors } = require('data/redux/hooks');

initializeMocks();

describe('ScoreViewInput', () => {
  const mockToggleFormat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    selectors.grades.useGradeData.mockReturnValue({
      gradeFormat: 'percent',
    });
    actions.grades.useToggleGradeFormat.mockReturnValue(mockToggleFormat);
  });

  it('renders without errors', () => {
    render(<ScoreViewInput />);

    expect(document.body).toBeInTheDocument();
  });

  it('renders form group with correct label', () => {
    render(<ScoreViewInput />);

    expect(screen.getByLabelText(/score view/i)).toBeInTheDocument();
  });

  it('renders select element with correct options', () => {
    render(<ScoreViewInput />);

    const select = screen.getByRole('combobox', { name: /score view/i });
    expect(select).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: /percent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /absolute/i }),
    ).toBeInTheDocument();
  });

  it('displays correct selected value for percent format', () => {
    selectors.grades.useGradeData.mockReturnValue({
      gradeFormat: 'percent',
    });

    render(<ScoreViewInput />);

    const select = screen.getByRole('combobox', { name: /score view/i });
    expect(select).toHaveValue('percent');
  });

  it('displays correct selected value for absolute format', () => {
    selectors.grades.useGradeData.mockReturnValue({
      gradeFormat: 'absolute',
    });

    render(<ScoreViewInput />);

    const select = screen.getByRole('combobox', { name: /score view/i });
    expect(select).toHaveValue('absolute');
  });

  it('calls toggle function when selection changes', async () => {
    render(<ScoreViewInput />);
    const user = userEvent.setup();

    const select = screen.getByRole('combobox', { name: /score view/i });

    await user.selectOptions(select, 'absolute');

    expect(mockToggleFormat).toHaveBeenCalledTimes(1);
  });

  describe('accessibility', () => {
    it('has proper form structure', () => {
      render(<ScoreViewInput />);

      const select = screen.getByRole('combobox', { name: /score view/i });
      const label = screen.getByText(/score view/i);

      expect(select).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    it('has accessible label association', () => {
      render(<ScoreViewInput />);

      const label = screen.getByText(/score view/i);
      const select = screen.getByRole('combobox', { name: /score view/i });

      expect(label).toBeInTheDocument();
      expect(select).toHaveAccessibleName(/score view/i);
    });

    it('has correct control ID for accessibility', () => {
      render(<ScoreViewInput />);

      const select = screen.getByRole('combobox', { name: /score view/i });
      expect(select).toHaveAttribute('id', 'ScoreView');
    });
  });

  describe('form control behavior', () => {
    it('renders as a select element', () => {
      render(<ScoreViewInput />);

      const select = screen.getByRole('combobox', { name: /score view/i });
      expect(select.tagName).toBe('SELECT');
    });

    it('has correct option values', () => {
      render(<ScoreViewInput />);

      const percentOption = screen.getByRole('option', { name: /percent/i });
      const absoluteOption = screen.getByRole('option', { name: /absolute/i });

      expect(percentOption).toHaveValue('percent');
      expect(absoluteOption).toHaveValue('absolute');
    });

    it('has exactly two options', () => {
      render(<ScoreViewInput />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
    });
  });

  describe('redux integration', () => {
    it('uses grade data selector hook', () => {
      render(<ScoreViewInput />);

      expect(selectors.grades.useGradeData).toHaveBeenCalledTimes(1);
    });

    it('uses toggle grade format action hook', () => {
      render(<ScoreViewInput />);

      expect(actions.grades.useToggleGradeFormat).toHaveBeenCalledTimes(1);
    });

    it('responds to different grade format values', () => {
      const { rerender } = render(<ScoreViewInput />);

      let select = screen.getByRole('combobox', { name: /score view/i });
      expect(select).toHaveValue('percent');

      selectors.grades.useGradeData.mockReturnValue({
        gradeFormat: 'absolute',
      });

      rerender(<ScoreViewInput />);
      select = screen.getByRole('combobox', { name: /score view/i });
      expect(select).toHaveValue('absolute');
    });
  });

  describe('user interactions', () => {
    it('handles option selection', async () => {
      render(<ScoreViewInput />);
      const user = userEvent.setup();

      const select = screen.getByRole('combobox', { name: /score view/i });

      await user.selectOptions(select, 'absolute');

      expect(mockToggleFormat).toHaveBeenCalledWith(expect.any(Object));
    });

    it('maintains state consistency', () => {
      render(<ScoreViewInput />);

      const select = screen.getByRole('combobox', { name: /score view/i });
      const percentOption = screen.getByRole('option', { name: /percent/i });

      expect(select).toHaveValue('percent');
      expect(percentOption).toBeInTheDocument();
    });
  });

  describe('internationalization', () => {
    it('displays localized label text', () => {
      render(<ScoreViewInput />);

      expect(screen.getByText('Score View:')).toBeInTheDocument();
    });

    it('displays localized option text', () => {
      render(<ScoreViewInput />);

      expect(screen.getByText('Percent')).toBeInTheDocument();
      expect(screen.getByText('Absolute')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('uses proper Bootstrap form classes', () => {
      render(<ScoreViewInput />);

      const select = screen.getByRole('combobox', { name: /score view/i });
      expect(select).toHaveClass('form-control');
    });

    it('renders within form group structure', () => {
      render(<ScoreViewInput />);

      const label = screen.getByText(/score view/i);
      const select = screen.getByRole('combobox', { name: /score view/i });

      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
      expect(select).toHaveAccessibleName(expect.stringMatching(/score view/i));
    });
  });
});
