import lms from '@src/data/services/lms';

/**
 * getCohorts(courseId)
 * Fetches the list of cohorts for the course.
 */
export const getCohorts = async (courseId: string) => {
  const { data } = await lms.api.fetch.cohorts(courseId);
  return data;
};

/**
 * getTracks(courseId)
 * Fetches the course's enrollment tracks (course modes).
 */
export const getTracks = async (courseId: string) => {
  const { data } = await lms.api.fetch.tracks(courseId);
  return data.course_modes;
};
