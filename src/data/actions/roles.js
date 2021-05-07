import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const errorFetching = createAction('roles/errorFetching');
const received = createAction('roles/received');

export default StrictDict({
  errorFetching,
  received,
});
