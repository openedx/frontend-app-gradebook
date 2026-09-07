import { useIntl } from '@openedx/frontend-base';

import { useFilters } from 'data/filtersContext';

import { useRefetchGrades } from '../data/hooks';
import messages from './messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const useSearchControlsData = () => {
  const { formatMessage } = useIntl();
  const { searchValue, setSearchValue } = useFilters();
  const fetchGrades = useRefetchGrades();

  const onBlur = (e) => {
    setSearchValue(e.target.value);
  };

  const onClear = () => {
    setSearchValue('');
    fetchGrades();
  };

  const onSubmit = (newValue) => {
    setSearchValue(newValue);
    fetchGrades();
  };

  return {
    onSubmit,
    onBlur,
    onClear,
    searchValue,
    inputLabel: formatMessage(messages.label),
    hintText: formatMessage(messages.hint),
  };
};

export default useSearchControlsData;
