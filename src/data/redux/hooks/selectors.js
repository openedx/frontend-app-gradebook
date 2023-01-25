import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const filters = StrictDict({
  useData: () => useSelector(selectors.filters.allFilters),
  useSelectableAssignmentLabels: () => useSelector(selectors.filters.selectableAssignmentLabels),
  useSelectedAssignmentLabel: () => useSelector(selectors.filters.selectedAssignmentLabel),
  useSelectedAssignmentType: () => useSelector(selectors.filters.selectedAssignmentType),
});

export default StrictDict({
  filters,
});
