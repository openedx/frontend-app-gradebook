import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { actions, selectors, thunkActions } from 'data/redux/hooks';

import useSearchControlsData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: { useSetSearchValue: jest.fn() },
  },
  selectors: {
    app: { useSearchValue: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchGrades: jest.fn() },
  },
}));

const searchValue = 'test-search-value';
selectors.app.useSearchValue.mockReturnValue(searchValue);
const setSearchValue = jest.fn();
actions.app.useSetSearchValue.mockReturnValue(setSearchValue);
const fetchGrades = jest.fn();
thunkActions.grades.useFetchGrades.mockReturnValue(fetchGrades);

const testValue = 'test-value';
let out;
describe('useSearchControlsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useSearchControlsData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(actions.app.useSetSearchValue).toHaveBeenCalled();
      expect(selectors.app.useSearchValue).toHaveBeenCalled();
      expect(thunkActions.grades.useFetchGrades).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    test('onSubmit sets search value and fetches grades', () => {
      out.onSubmit(testValue);
      expect(setSearchValue).toHaveBeenCalledWith(testValue);
      expect(fetchGrades).toHaveBeenCalled();
    });
    test('onBlur sets search value to event target', () => {
      out.onBlur({ target: { value: testValue } });
      expect(setSearchValue).toHaveBeenCalledWith(testValue);
      expect(fetchGrades).not.toHaveBeenCalled();
    });
    test('onClear clears search value and fetches grades', () => {
      out.onClear();
      expect(setSearchValue).toHaveBeenCalledWith('');
      expect(fetchGrades).toHaveBeenCalled();
    });
    it('forwards searchValue from redux', () => {
      expect(out.searchValue).toEqual(searchValue);
    });
    test('input label message', () => {
      expect(out.inputLabel).toEqual(formatMessage(messages.label));
    });
    test('hint text message', () => {
      expect(out.hintText).toEqual(formatMessage(messages.hint));
    });
  });
});
