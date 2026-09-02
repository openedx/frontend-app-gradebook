const BASE_KEY = ['gradebook'] as const;

/**
 * The main gradebook rows. The base key is a prefix of each paged key (see
 * `useGrades`), so invalidating `byCourse(courseId)` refetches any page.
 */
export const gradesQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'grades'] as const,
};

/** Grade-override history for one learner on one subsection (edit modal). */
export const gradeOverrideHistoryQueryKeys = {
  all: [...BASE_KEY, 'gradeOverrideHistory'] as const,
  byCell: (
    subsectionId: string | null,
    userId: string | number | null,
  ) => [...BASE_KEY, 'gradeOverrideHistory', subsectionId, userId] as const,
};
