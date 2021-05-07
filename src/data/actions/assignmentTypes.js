import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const fetching = {
  error: createAction('assignmentTypes/fetching/error'),
  started: createAction('assignmentTypes/fetching/started'),
  received: createAction('assignmentTypes/fetching/received'),
};
const gotGradesFrozen = createAction('assignmentTypes/gotGradesFrozen');

const actions = StrictDict({
  fetching,
  gotGradesFrozen,
});
export default actions;
