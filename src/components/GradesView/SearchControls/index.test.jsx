import React from 'react';
import { initializeMocks, render, screen } from 'testUtilsExtra';

import useSearchControlsData from './hooks';
import SearchControls from '.';

jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('react');
jest.mock('./hooks', () => jest.fn());

const hookProps = {
  onSubmit: jest.fn().mockName('hooks.onSubmit'),
  onBlur: jest.fn().mockName('hooks.onBlur'),
  onClear: jest.fn().mockName('hooks.onClear'),
  searchValue: 'test-search-value',
  inputLabel: 'test-input-label',
  hintText: 'test-hint-text',
};
useSearchControlsData.mockReturnValue(hookProps);
describe('SearchControls component', () => {
  beforeEach(() => {
    initializeMocks();
    render(<SearchControls />);
    jest.clearAllMocks();
  });
  describe('render', () => {
    test('search field', () => {
      expect(screen.getByLabelText(hookProps.inputLabel)).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toHaveValue(hookProps.searchValue);
    });
    test('hint text', () => {
      expect(screen.getByText(hookProps.hintText)).toBeInTheDocument();
    });
  });
});
