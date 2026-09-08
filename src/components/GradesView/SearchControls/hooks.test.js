import React from 'react';

import { renderWithAllProviders } from '@src/testUtils';
import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades } from '../data/hooks';
import useSearchControlsData from './hooks';
import messages from './messages';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useRefetchGrades: jest.fn(),
}));

// `useSearchControlsData` uses `useIntl` from `@openedx/frontend-base`, which
// requires the full provider tree exposed by `renderWithAllProviders`.
const captureHook = () => {
  let hookResult;
  const Capture = () => {
    hookResult = useSearchControlsData();
    return null;
  };
  renderWithAllProviders(<Capture />);
  return hookResult;
};

const primeMocks = ({ searchValue = 'query' } = {}) => {
  const setSearchValue = jest.fn();
  const fetchGrades = jest.fn();
  useFilters.mockReturnValue({ searchValue, setSearchValue });
  useRefetchGrades.mockReturnValue(fetchGrades);
  return { setSearchValue, fetchGrades };
};

describe('useSearchControlsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the current search value and formatted labels', () => {
    primeMocks({ searchValue: 'foo' });
    const out = captureHook();
    expect(out.searchValue).toBe('foo');
    expect(out.inputLabel).toBe(messages.label.defaultMessage);
    expect(out.hintText).toBe(messages.hint.defaultMessage);
  });

  it('onSubmit stores the new value and fetches grades', () => {
    const { setSearchValue, fetchGrades } = primeMocks();
    const out = captureHook();
    out.onSubmit('new-value');
    expect(setSearchValue).toHaveBeenCalledWith('new-value');
    expect(fetchGrades).toHaveBeenCalled();
  });

  it('onBlur only updates the value, without fetching', () => {
    const { setSearchValue, fetchGrades } = primeMocks();
    const out = captureHook();
    out.onBlur({ target: { value: 'blurred' } });
    expect(setSearchValue).toHaveBeenCalledWith('blurred');
    expect(fetchGrades).not.toHaveBeenCalled();
  });

  it('onClear resets to empty and fetches grades', () => {
    const { setSearchValue, fetchGrades } = primeMocks();
    const out = captureHook();
    out.onClear();
    expect(setSearchValue).toHaveBeenCalledWith('');
    expect(fetchGrades).toHaveBeenCalled();
  });
});
