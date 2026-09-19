// Pure, framework-agnostic formatting helpers used by the live data layer. These
// were previously exported from `data/actions/utils.js` (a Redux module that also
// imported `@reduxjs/toolkit`); they are relocated here so the runtime path no
// longer pulls Redux in. Logic is unchanged.

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

/** Formats a Date as "Month D, YYYY at HH:MM TZ" (UTC), for history/modal display. */
export const formatDateForDisplay = (inputDate) => {
  const date = inputDate.toLocaleDateString('en-US', options);
  const time = inputDate.toLocaleTimeString('en-US', timeOptions);
  return `${date} at ${time}`;
};

/** Case-insensitive comparator sorting grade rows by username (ascending). */
export const sortAlphaAsc = (gradeRowA, gradeRowB) => {
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
