import lms from 'data/services/lms';

/**
 * getCohorts()
 * Fetches the list of cohorts for the course.
 */
export const getCohorts = async () => {
  const { data } = await lms.api.fetch.cohorts();
  return data;
};

/**
 * getTracks()
 * Fetches the course's enrollment tracks (course modes).
 */
export const getTracks = async () => {
  const { data } = await lms.api.fetch.tracks();
  return data.course_modes;
};
