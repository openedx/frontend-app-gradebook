import { createAction } from '@reduxjs/toolkit';

export const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};
export const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
};

const formatDateForDisplay = (inputDate) => {
  const date = inputDate.toLocaleDateString('en-US', options);
  const time = inputDate.toLocaleTimeString('en-US', timeOptions);
  return `${date} at ${time}`;
};

const sortAlphaAsc = (gradeRowA, gradeRowB) => {
  const a = gradeRowA.username.toUpperCase();
  const b = gradeRowB.username.toUpperCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const createActionFactory = (dataKey) => (actionKey, ...args) => (
  createAction(`${dataKey}/${actionKey}`, ...args)
);

export {
  createActionFactory,
  sortAlphaAsc,
  formatDateForDisplay,
};
