import { useIntl } from '@edx/frontend-platform/i18n';

import { useFilters } from 'data/filtersContext';

import { useRefetchGrades } from './data/hooks';
import messages from './messages';

export const useGradesViewData = ({ updateQueryParams }) => {
  const { formatMessage } = useIntl();
  const fetchGrades = useRefetchGrades();
  const { resetFilters: resetContextFilters } = useFilters();

  const handleFilterBadgeClose = (filterNames) => () => {
    resetContextFilters(filterNames);
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
