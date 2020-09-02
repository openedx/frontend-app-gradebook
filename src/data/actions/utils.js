const formatDateForDisplay = (inputDate) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };
  return `${inputDate.toLocaleDateString('en-US', options)} at ${inputDate.toLocaleTimeString('en-US', timeOptions)}`;
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

export { sortAlphaAsc, formatDateForDisplay };
