import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'assignmentTypes';
const createAction = createActionFactory(dataKey);

const fetching = {
  error: createAction('fetching/error'),
  started: createAction('fetching/started'),
  received: createAction('fetching/received'),
};
const gotGradesFrozen = createAction('gotGradesFrozen');

export default StrictDict({
  fetching: StrictDict(fetching),
  gotGradesFrozen,
});
