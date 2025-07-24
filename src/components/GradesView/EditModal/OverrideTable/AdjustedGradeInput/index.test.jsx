import React from 'react';
import { render, screen } from '@testing-library/react';

import useAdjustedGradeInputData from './hooks';
import AdjustedGradeInput from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  hintText: 'some-hint-text',
  onChange: jest.fn().mockName('hook.onChange'),
  value: 'test-value',
};
useAdjustedGradeInputData.mockReturnValue(hookProps);

describe('AdjustedGradeInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<AdjustedGradeInput />);
  });
  describe('render', () => {
    test('renders input with correct props', () => {
      screen.debug();
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(hookProps.value);
      expect(screen.getByText(hookProps.hintText)).toBeInTheDocument();
    });
  });
});
