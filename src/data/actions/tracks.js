import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const fetching = {
  started: createAction('tracks/fetching/started'),
  error: createAction('tracks/fetching/error'),
  received: createAction('tracks/fetching/received'),
};

export default StrictDict({
  fetching,
});
