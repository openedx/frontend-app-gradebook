import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'roles';
const createAction = createActionFactory(dataKey);

const fetching = {
  error: createAction('fetching/error'),
  received: createAction('fetching/received'),
};

export default StrictDict({
  fetching: StrictDict(fetching),
});
