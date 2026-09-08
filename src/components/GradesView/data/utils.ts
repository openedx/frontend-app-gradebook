import { StrictDict } from '@src/utils';

import { Headings, GradeFormats } from '@src/data/constants/grades';
import initialFilters from '@src/data/constants/filters';
import { formatDateForDisplay } from '@src/data/formatUtils';
import { getLocalizedSlash } from '@src/i18n/utils';
import type { FiltersSnapshot } from '@src/data/filtersSnapshot';

/* ------------------------------------------------------------------ *
 * Grade formatting
 * ------------------------------------------------------------------ */

export const minGrade = '0';
export const maxGrade = '100';

/** A percent grade, or null when equal to the max. */
export const formatMaxCourseGrade = (percentGrade: string): string | null => (
  percentGrade === maxGrade ? null : percentGrade
);

/** A percent grade, or null when equal to the min. */
export const formatMinCourseGrade = (percentGrade: string): string | null => (
  percentGrade === minGrade ? null : percentGrade
);

/** Same as `formatMaxCourseGrade` but also null when no assignment is selected. */
export const formatMaxAssignmentGrade = (
  percentGrade: string,
  options: { assignmentId?: string | undefined },
): string | null => (
  (percentGrade === maxGrade || !options.assignmentId) ? null : percentGrade
);

/** Same as `formatMinCourseGrade` but also null when no assignment is selected. */
export const formatMinAssignmentGrade = (
  percentGrade: string,
  options: { assignmentId?: string | undefined },
): string | null => (
  (percentGrade === minGrade || !options.assignmentId) ? null : percentGrade
);

/** Round a number to two decimal places (defaults to 0). */
export const roundGrade = (val: number | undefined | null): number => (
  parseFloat((val || 0).toFixed(2))
);

/**
 * subsectionGrade[format](subsection)
 * Formats one subsection cell for the gradebook table.
 * - `absolute`: rounded `earned/possible` if attempted, else `earned`.
 * - `percent`: rounded `percent * 100`.
 */
export const subsectionGrade = StrictDict({
  [GradeFormats.absolute]: (subsection: {
    score_earned?: number;
    score_possible?: number;
    attempted?: boolean;
  }): string => {
    const earned = roundGrade(subsection.score_earned);
    const possible = roundGrade(subsection.score_possible);
    return subsection.attempted ? `${earned}${getLocalizedSlash()}${possible}` : `${earned}`;
  },
  [GradeFormats.percent]: (subsection: { percent?: number }): number => (
    roundGrade((subsection.percent ?? 0) * 100)
  ),
}) as Record<string, (subsection: any) => string | number>;

/* ------------------------------------------------------------------ *
 * Grade override history (edit modal)
 * ------------------------------------------------------------------ */

/** One raw entry from the grade-override history endpoint. */
export interface RawGradeOverrideHistoryItem {
  history_date: string;
  history_user: string;
  override_reason: string;
  earned_graded_override: unknown;
}

/** Display-shaped grade-override history entry. */
export interface DisplayGradeOverrideHistoryItem {
  date: string;
  grader: string;
  reason: string;
  adjustedGrade: unknown;
}

/** Map the raw override-history entries into what the edit modal renders. */
export const formatGradeOverrideForDisplay = (
  historyArray: RawGradeOverrideHistoryItem[],
): DisplayGradeOverrideHistoryItem[] => historyArray.map(item => ({
  date: formatDateForDisplay(new Date(item.history_date)),
  grader: item.history_user,
  reason: item.override_reason,
  adjustedGrade: item.earned_graded_override,
}));

/* ------------------------------------------------------------------ *
 * Table headings + assignment filter derivations
 * ------------------------------------------------------------------ */

/** A section-breakdown entry inside a grade row. */
export interface SectionBreakdownEntry {
  label?: string;
  category?: string;
  subsection_name?: string;
  module_id?: string;
  [key: string]: unknown;
}

/** Relevant assignment info the filter dropdown consumes. */
export interface AssignmentSummary {
  label: string;
  subsectionLabel: string;
  type: string;
  id: string;
}

/**
 * headingMapper(category, label)
 * Returns a function that, given a section breakdown, returns the table headers
 * for the current assignment-type + assignment-label filters.
 */
export const headingMapper = (
  category: string,
  label: string = 'All',
) => {
  const filters = {
    all: (section: SectionBreakdownEntry) => !!section.label,
    byCategory: (section: SectionBreakdownEntry) => (
      !!section.label && section.category === category
    ),
    byLabel: (section: SectionBreakdownEntry) => (
      !!section.label && section.label === label
    ),
  };

  let filter: (section: SectionBreakdownEntry) => boolean;
  if (label === 'All') {
    filter = category === 'All' ? filters.all : filters.byCategory;
  } else {
    filter = filters.byLabel;
  }
  const {
    username, fullName, email, totalGrade,
  } = Headings;
  const filteredLabels = (entry: SectionBreakdownEntry[]) => (
    entry.filter(filter).map(s => s.label)
  );

  return (entry: SectionBreakdownEntry[] | null | undefined): (string | undefined)[] => (
    entry
      ? [username, fullName, email, ...filteredLabels(entry), totalGrade]
      : []
  );
};

/** Section-breakdown of the first grades result (empty if none). */
export const getAssignmentsFromResultsSubstate = (
  results: { section_breakdown?: SectionBreakdownEntry[] }[],
): SectionBreakdownEntry[] => (
  (results[0] || {}).section_breakdown || []
);

/** Reshape one section-breakdown entry into filter-friendly fields. */
export const chooseRelevantAssignmentData = ({
  label,
  subsection_name: subsectionLabel,
  category: type,
  module_id: id,
}: SectionBreakdownEntry): AssignmentSummary => ({
  label: label as string,
  subsectionLabel: subsectionLabel as string,
  type: type as string,
  id: id as string,
});

/** Look up the relevant assignment data by id inside a grades results array. */
export const relevantAssignmentDataFromResults = (
  results: { section_breakdown?: SectionBreakdownEntry[] }[],
  id: string,
): AssignmentSummary | undefined => (
  getAssignmentsFromResultsSubstate(results)
    .map(chooseRelevantAssignmentData)
    .find(assignment => assignment.id === id)
);

/** Whether a filter value equals the initial (default) value for that filter. */
export const isDefault = (name: string, value: unknown): boolean => (
  value === (initialFilters as Record<string, unknown>)[name]
);

/* ------------------------------------------------------------------ *
 * Grades fetch params (built from the filters snapshot)
 * ------------------------------------------------------------------ */

/** Params object the `getGrades` API call consumes. */
export interface GradesFetchParams {
  searchText: string | null;
  cohort: string;
  track: string;
  options: {
    assignment: string | undefined;
    includeCourseRoleMembers: boolean;
    assignmentGradeMax: string | null;
    assignmentGradeMin: string | null;
    courseGradeMax: string | null;
    courseGradeMin: string | null;
    searchText?: string;
  };
}

/**
 * buildGradesFetchParams(snapshot)
 * Build the `getGrades` params from a filters snapshot. Mirrors the legacy
 * `selectors.root.localFilters` shape: assignment grade limits collapse to
 * `null` when no assignment is selected or the value equals the min/max
 * boundary; the course grade limits collapse to `null` at the boundaries.
 */
export const buildGradesFetchParams = (
  snapshot: FiltersSnapshot,
): GradesFetchParams => {
  const {
    assignment,
    assignmentGradeMin, assignmentGradeMax,
    courseGradeMin, courseGradeMax,
    cohort, track,
    includeCourseRoleMembers,
    searchValue,
  } = snapshot;
  const assignmentId = assignment || undefined;
  const opts = { assignmentId };
  const options = {
    assignment: assignmentId,
    includeCourseRoleMembers,
    assignmentGradeMax: formatMaxAssignmentGrade(assignmentGradeMax, opts),
    assignmentGradeMin: formatMinAssignmentGrade(assignmentGradeMin, opts),
    courseGradeMax: formatMaxCourseGrade(courseGradeMax),
    courseGradeMin: formatMinCourseGrade(courseGradeMin),
    ...(searchValue !== '' && { searchText: searchValue }),
  };
  return {
    searchText: options.searchText || null,
    cohort,
    track,
    options,
  };
};
