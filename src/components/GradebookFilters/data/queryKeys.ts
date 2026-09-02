const BASE_KEY = ['gradebook'] as const;

/** Cohorts available for the course (cohort filter dropdown). */
export const cohortsQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'cohorts'] as const,
};

/** Enrollment tracks / course modes for the course (track filter dropdown). */
export const tracksQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'tracks'] as const,
};
