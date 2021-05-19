import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'roles';
const createAction = createActionFactory(dataKey);

const fetching = {
  error: createAction('errorFetching'),
  received: createAction('received'),
};

export default StrictDict({
  fetching: StrictDict(fetching),
});
