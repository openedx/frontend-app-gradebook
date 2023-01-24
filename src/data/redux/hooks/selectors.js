import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const filters = StrictDict({
  useData: () => useSelector(selectors.allFilters),
  useSelectedAssignmentLabels: () => useSelector(selectors.selectedAssignmentLabels),
  useSelectedAssignmentLabel: () => useSelector(selectors.selectedAssignmentLabel),
  useSelectedAssignmentType: () => useSelector(selectors.selectedAssignmentType),
});

export default StrictDict({
  filters,
});
