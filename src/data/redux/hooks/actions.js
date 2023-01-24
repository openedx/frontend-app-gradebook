import { StrictDict } from 'utils';
import actions from 'data/actions';
import { actionHook } from './utils';

const filters = StrictDict({
  useUpdateAssignment: actionHook(actions.filters.update.assignment),
});

export default StrictDict({
  filters,
});
