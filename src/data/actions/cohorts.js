import { createAction } from '@reduxjs/toolkit';


const startedFetching = createAction('cohorts/startedFetching');
const errorFetching = createAction('cohorts/errorFetching');
const received = createAction('cohorts/received');

export {
  errorFetching,
  received,
  startedFetching,
};
