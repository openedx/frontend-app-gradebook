import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'cohorts';
const createAction = createActionFactory(dataKey);

const fetching = {
  started: createAction('fetching/started'),
  error: createAction('fetching/error'),
  /**
   * fetching.received(results)
   * @param {object[]} results - cohorts fetch results
   */
  received: createAction('fetching/received'),
};

export default StrictDict({
  fetching: StrictDict(fetching),
});
