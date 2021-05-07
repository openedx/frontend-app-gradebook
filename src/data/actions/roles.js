import { createAction } from '@reduxjs/toolkit';

const errorFetching = createAction('roles/errorFetching');
const received = createAction('roles/received');

export {
  errorFetching,
  received,
};
