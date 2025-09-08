import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, thunkActions } from 'data/redux/hooks';

import useGradesViewData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    filters: { useResetFilters: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchGrades: jest.fn() },
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(context => context),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: jest.fn(() => ({
    formatMessage: (message) => message.defaultMessage,
  })),
}));

const fetchGrades = jest.fn();
thunkActions.grades.useFetchGrades.mockReturnValue(fetchGrades);
const resetFilters = jest.fn();
actions.filters.useResetFilters.mockReturnValue(resetFilters);

const updateQueryParams = jest.fn();

let out;
describe('useGradesViewData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useGradesViewData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(thunkActions.grades.useFetchGrades).toHaveBeenCalled();
      expect(actions.filters.useResetFilters).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    test('stepHeadings', () => {
      expect(out.stepHeadings.filter).toEqual(messages.filterStepHeading.defaultMessage);
      expect(out.stepHeadings.gradebook).toEqual(messages.gradebookStepHeading.defaultMessage);
    });
    test('mastersHint', () => {
      expect(out.mastersHint).toEqual(messages.mastersHint.defaultMessage);
    });
    describe('handleFilterBadgeClose', () => {
      it('resets filters locally and in query params, and fetches grades', () => {
        const filters = ['some', 'filter', 'names'];
        out.handleFilterBadgeClose(filters)();
        expect(resetFilters).toHaveBeenCalledWith(filters);
        expect(updateQueryParams).toHaveBeenCalledWith({
          some: false,
          filter: false,
          names: false,
        });
        expect(fetchGrades).toHaveBeenCalled();
      });
    });
  });
});
