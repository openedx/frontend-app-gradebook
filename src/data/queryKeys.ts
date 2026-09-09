// Top-level (app-wide) query-key factories, mirroring the instructor dashboard's
// `src/data/queryKeys.ts`: shared server-state that multiple features gate on
// lives here (the roles permission gate + the assignment-types/config bundle used
// by the header, filters, and bulk-management views).
//
// Keys are namespaced under `BASE_KEY` and scoped by `courseId` so React Query
// caches independently per course and mutations can invalidate a whole course
// subtree via a broad prefix. The array shapes match the legacy
// `gradebookQueryKeys` so cache identity / invalidation is preserved.
export const BASE_KEY = ['gradebook'] as const;

/** Roles-based "can view the gradebook" permission gate (the fetch-cascade root). */
export const rolesQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'roles'] as const,
};

/** Assignment types + grades-frozen / bulk-management flags (app-wide config). */
export const assignmentTypesQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'assignmentTypes'] as const,
};
