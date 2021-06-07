import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'assignmentTypes';
const createAction = createActionFactory(dataKey);

const fetching = {
  error: createAction('fetching/error'),
  started: createAction('fetching/started'),
  /**
   * fetching.received(results)
   * @param {object[]} results - assignmentType fetch results
   */
  received: createAction('fetching/received'),
};
/**
 * gotGradesFrozen(areGradesFrozen)
 * @param {bool} are grades frozen?
 */
const gotGradesFrozen = createAction('gotGradesFrozen');

export default StrictDict({
  fetching: StrictDict(fetching),
  gotGradesFrozen,
});
