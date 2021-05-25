import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'tracks';
const createAction = createActionFactory(dataKey);

const fetching = {
  started: createAction('fetching/started'),
  error: createAction('fetching/error'),
  received: createAction('fetching/received'),
};

export default StrictDict({
  fetching: StrictDict(fetching),
});
