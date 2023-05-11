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

export default formatDateForDisplay;
