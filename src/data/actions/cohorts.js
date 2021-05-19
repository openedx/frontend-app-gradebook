import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'cohorts';
const createAction = createActionFactory(dataKey);

const fetching = {
  started: createAction('startedFetching'),
  error: createAction('errorFetching'),
  received: createAction('received'),
};

export default StrictDict({
  fetching: StrictDict(fetching),
});
