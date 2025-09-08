import { render, screen } from '@testing-library/react';

import useReasonInputData from './hooks';
import ReasonInput from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  ref: jest.fn().mockName('hook.ref'),
  onChange: jest.fn().mockName('hook.onChange'),
  value: 'test-value',
};
useReasonInputData.mockReturnValue(hookProps);

describe('ReasonInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ReasonInput />);
  });
  describe('behavior', () => {
    it('initializes hook data', () => {
      expect(useReasonInputData).toHaveBeenCalled();
    });
  });
  describe('renders', () => {
    it('input correctly', () => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue(hookProps.value);
    });
  });
});
