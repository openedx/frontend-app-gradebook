import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const fetching = {
  started: createAction('cohorts/startedFetching'),
  error: createAction('cohorts/errorFetching'),
  received: createAction('cohorts/received'),
};

export default StrictDict({
  fetching,
});
