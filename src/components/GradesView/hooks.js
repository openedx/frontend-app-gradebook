import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, thunkActions } from 'data/redux/hooks';
import messages from './messages';

export const useGradesViewData = ({ updateQueryParams }) => {
  const { formatMessage } = useIntl();
  const fetchGrades = thunkActions.grades.useFetchGrades();
  const resetFilters = actions.filters.useResetFilters();

  const handleFilterBadgeClose = (filterNames) => () => {
    resetFilters(filterNames);
    updateQueryParams(filterNames.reduce(
      (obj, filterName) => ({ ...obj, [filterName]: false }),
      {},
    ));
    fetchGrades();
  };

  return {
    stepHeadings: {
      filter: formatMessage(messages.filterStepHeading),
      gradebook: formatMessage(messages.gradebookStepHeading),
    },
    handleFilterBadgeClose,
    mastersHint: formatMessage(messages.mastersHint),
  };
};

export default useGradesViewData;
