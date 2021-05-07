import { createAction } from '@reduxjs/toolkit';

const errorFetching = createAction('assignmentTypes/errorFetching');
const startedFetching = createAction('assignmentTypes/startedFetching');

const received = createAction('assignmentTypes/results'); // payload
const gotGradesFrozen = createAction('assignmentTypes/gotGradesFrozen'); // payload

export {
  errorFetching,
  startedFetching,
  received,
  gotGradesFrozen,
};
