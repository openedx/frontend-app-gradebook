/* eslint-disable import/prefer-default-export */
import { createAction } from '@reduxjs/toolkit';

const fetching = {
  started: createAction('tracks/fetching/started'),
  error: createAction('tracks/fetching/error'),
  received: createAction('tracks/fetching/received'),
};

export {
  fetching,
};
