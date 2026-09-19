import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import initialFilters from '@src/data/constants/filters';
import { filtersSnapshot } from '@src/data/filtersSnapshot';

/**
 * Client-side gradebook filter state, held in React (Context + useState).
 *
 * Replaces the Redux `filters` slice (and the live grade-limit inputs from the
 * `app` slice). The provider also mirrors the fetch-relevant values into the
 * synchronous `filtersSnapshot`, which the grades queryFn reads at fetch time.
 */
export interface FiltersContextValue {
  assignmentType: string;
  setAssignmentType: (value: string) => void;
  // The selected assignment id; the label/type are derived from the grades
  // query results.
  assignment: string;
  setAssignment: (value: string) => void;
  includeCourseRoleMembers: boolean;
  setIncludeCourseRoleMembers: (value: boolean) => void;
  cohort: string;
  setCohort: (value: string) => void;
  track: string;
  setTrack: (value: string) => void;
  assignmentGradeMin: string;
  setAssignmentGradeMin: (value: string) => void;
  assignmentGradeMax: string;
  setAssignmentGradeMax: (value: string) => void;
  courseGradeMin: string;
  setCourseGradeMin: (value: string) => void;
  courseGradeMax: string;
  setCourseGradeMax: (value: string) => void;
  // Username/email search text (was Redux `app.searchValue`). Not persisted in the
  // URL, so it starts empty.
  searchValue: string;
  setSearchValue: (value: string) => void;
  // Applied (committed-on-Apply) grade-limit values. The setters above hold the
  // "live" input values (per keystroke); these hold what was last applied and are
  // what the filter badges + export URLs reflect (was the Redux `filters` slice
  // grade limits, set by `update.assignmentLimits`/`update.courseGradeLimits`).
  appliedAssignmentGradeMin: string;
  appliedAssignmentGradeMax: string;
  appliedCourseGradeMin: string;
  appliedCourseGradeMax: string;
  applyAssignmentGradeLimits: (limits: { assignmentGradeMin: string; assignmentGradeMax: string }) => void;
  applyCourseGradeLimits: (limits: { courseGradeMin: string; courseGradeMax: string }) => void;
  /**
   * Reset the given filter names to their defaults (used by the active-filter
   * badge close buttons). Resets both the live and applied grade-limit values.
   * Was the Redux `filters.reset` action.
   */
  resetFilters: (filterNames: string[]) => void;
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

interface FiltersProviderProps {
  children: React.ReactNode;
}

export const FiltersProvider = ({ children }: FiltersProviderProps) => {
  const [searchParams] = useSearchParams();
  // Initial values seeded from the URL query (mirrors the legacy
  // `filters.initialize(urlQuery)`). Computed once.
  const initialValues = useMemo(() => ({
    assignmentType: searchParams.get('assignmentType') ?? initialFilters.assignmentType,
    assignment: searchParams.get('assignment') ?? initialFilters.assignment,
    includeCourseRoleMembers: searchParams.get('includeCourseRoleMembers') === 'true',
    cohort: searchParams.get('cohort') ?? initialFilters.cohort,
    track: searchParams.get('track') ?? initialFilters.track,
    assignmentGradeMin: searchParams.get('assignmentGradeMin') ?? initialFilters.assignmentGradeMin,
    assignmentGradeMax: searchParams.get('assignmentGradeMax') ?? initialFilters.assignmentGradeMax,
    courseGradeMin: searchParams.get('courseGradeMin') ?? initialFilters.courseGradeMin,
    courseGradeMax: searchParams.get('courseGradeMax') ?? initialFilters.courseGradeMax,
    searchValue: '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // Seed the synchronous snapshot from the URL values on the first render, before
  // the grades query (which reads it in its queryFn) fires — the query is gated on
  // the roles query, so it resolves well after this. The wrapped setters below keep
  // the snapshot in sync synchronously thereafter.
  const snapshotSeeded = useRef(false);
  if (!snapshotSeeded.current) {
    Object.assign(filtersSnapshot, initialValues);
    snapshotSeeded.current = true;
  }

  const [assignmentType, setAssignmentTypeState] = useState<string>(initialValues.assignmentType);
  const [assignment, setAssignmentState] = useState<string>(initialValues.assignment);
  const [includeCourseRoleMembers, setIncludeCourseRoleMembersState] = useState<boolean>(
    initialValues.includeCourseRoleMembers,
  );
  const [cohort, setCohortState] = useState<string>(initialValues.cohort);
  const [track, setTrackState] = useState<string>(initialValues.track);
  // Grade-limit "live" values (previously the Redux `app.filters` sub-slice).
  const [assignmentGradeMin, setAssignmentGradeMinState] = useState<string>(
    initialValues.assignmentGradeMin,
  );
  const [assignmentGradeMax, setAssignmentGradeMaxState] = useState<string>(
    initialValues.assignmentGradeMax,
  );
  const [courseGradeMin, setCourseGradeMinState] = useState<string>(initialValues.courseGradeMin);
  const [courseGradeMax, setCourseGradeMaxState] = useState<string>(initialValues.courseGradeMax);
  const [searchValue, setSearchValueState] = useState<string>(initialValues.searchValue);

  // Applied grade-limit values (committed on Apply). Seeded from the URL values, so
  // on a deep link the badges/export match the initial fetch.
  const [appliedAssignmentGradeMin, setAppliedAssignmentGradeMin] = useState<string>(
    initialValues.assignmentGradeMin,
  );
  const [appliedAssignmentGradeMax, setAppliedAssignmentGradeMax] = useState<string>(
    initialValues.assignmentGradeMax,
  );
  const [appliedCourseGradeMin, setAppliedCourseGradeMin] = useState<string>(
    initialValues.courseGradeMin,
  );
  const [appliedCourseGradeMax, setAppliedCourseGradeMax] = useState<string>(
    initialValues.courseGradeMax,
  );

  // Wrapped setters: update the synchronous snapshot first (so the grades queryFn
  // reads the latest value at invalidate time), then the React state.
  const setAssignmentType = useCallback((v: string) => {
    filtersSnapshot.assignmentType = v;
    setAssignmentTypeState(v);
  }, []);
  const setAssignment = useCallback((v: string) => {
    filtersSnapshot.assignment = v;
    setAssignmentState(v);
  }, []);
  const setIncludeCourseRoleMembers = useCallback((v: boolean) => {
    filtersSnapshot.includeCourseRoleMembers = v;
    setIncludeCourseRoleMembersState(v);
  }, []);
  const setCohort = useCallback((v: string) => {
    filtersSnapshot.cohort = v;
    setCohortState(v);
  }, []);
  const setTrack = useCallback((v: string) => {
    filtersSnapshot.track = v;
    setTrackState(v);
  }, []);
  // The grade-limit setters hold live (per-keystroke) input values, so they do
  // NOT touch the snapshot: fetches must only ever see the applied values, which
  // `applyAssignmentGradeLimits`/`applyCourseGradeLimits`/`resetFilters` commit
  // to the snapshot below (matching the legacy split between the live `app`
  // inputs and the apply-committed `filters` slice the fetch read).
  const setAssignmentGradeMin = useCallback((v: string) => {
    setAssignmentGradeMinState(v);
  }, []);
  const setAssignmentGradeMax = useCallback((v: string) => {
    setAssignmentGradeMaxState(v);
  }, []);
  const setCourseGradeMin = useCallback((v: string) => {
    setCourseGradeMinState(v);
  }, []);
  const setCourseGradeMax = useCallback((v: string) => {
    setCourseGradeMaxState(v);
  }, []);
  const setSearchValue = useCallback((v: string) => {
    filtersSnapshot.searchValue = v;
    setSearchValueState(v);
  }, []);

  const applyAssignmentGradeLimits = useCallback(
    ({ assignmentGradeMin: min, assignmentGradeMax: max }: {
      assignmentGradeMin: string; assignmentGradeMax: string;
    }) => {
      filtersSnapshot.assignmentGradeMin = min;
      filtersSnapshot.assignmentGradeMax = max;
      setAppliedAssignmentGradeMin(min);
      setAppliedAssignmentGradeMax(max);
    },
    [],
  );
  const applyCourseGradeLimits = useCallback(
    ({ courseGradeMin: min, courseGradeMax: max }: {
      courseGradeMin: string; courseGradeMax: string;
    }) => {
      filtersSnapshot.courseGradeMin = min;
      filtersSnapshot.courseGradeMax = max;
      setAppliedCourseGradeMin(min);
      setAppliedCourseGradeMax(max);
    },
    [],
  );

  // Reset the named filters to their defaults (badge close). Mirrors the Redux
  // `filters.reset`; also clears the applied grade-limit values so the badges/export
  // update. The wrapped setters keep the snapshot in sync for the grades fetch.
  const resetFilters = useCallback((filterNames: string[]) => {
    filterNames.forEach((name) => {
      switch (name) {
        case 'assignmentType':
          setAssignmentType(initialFilters.assignmentType);
          break;
        case 'assignment':
          setAssignment(initialFilters.assignment);
          break;
        case 'cohort':
          setCohort(initialFilters.cohort);
          break;
        case 'track':
          setTrack(initialFilters.track);
          break;
        case 'includeCourseRoleMembers':
          setIncludeCourseRoleMembers(initialFilters.includeCourseRoleMembers);
          break;
        case 'assignmentGradeMin':
          filtersSnapshot.assignmentGradeMin = initialFilters.assignmentGradeMin;
          setAssignmentGradeMin(initialFilters.assignmentGradeMin);
          setAppliedAssignmentGradeMin(initialFilters.assignmentGradeMin);
          break;
        case 'assignmentGradeMax':
          filtersSnapshot.assignmentGradeMax = initialFilters.assignmentGradeMax;
          setAssignmentGradeMax(initialFilters.assignmentGradeMax);
          setAppliedAssignmentGradeMax(initialFilters.assignmentGradeMax);
          break;
        case 'courseGradeMin':
          filtersSnapshot.courseGradeMin = initialFilters.courseGradeMin;
          setCourseGradeMin(initialFilters.courseGradeMin);
          setAppliedCourseGradeMin(initialFilters.courseGradeMin);
          break;
        case 'courseGradeMax':
          filtersSnapshot.courseGradeMax = initialFilters.courseGradeMax;
          setCourseGradeMax(initialFilters.courseGradeMax);
          setAppliedCourseGradeMax(initialFilters.courseGradeMax);
          break;
        default: break;
      }
    });
  }, [
    setAssignmentType, setAssignment, setCohort, setTrack, setIncludeCourseRoleMembers,
    setAssignmentGradeMin, setAssignmentGradeMax, setCourseGradeMin, setCourseGradeMax,
  ]);

  const value = useMemo<FiltersContextValue>(
    () => ({
      assignmentType,
      setAssignmentType,
      assignment,
      setAssignment,
      includeCourseRoleMembers,
      setIncludeCourseRoleMembers,
      cohort,
      setCohort,
      track,
      setTrack,
      assignmentGradeMin,
      setAssignmentGradeMin,
      assignmentGradeMax,
      setAssignmentGradeMax,
      courseGradeMin,
      setCourseGradeMin,
      courseGradeMax,
      setCourseGradeMax,
      searchValue,
      setSearchValue,
      appliedAssignmentGradeMin,
      appliedAssignmentGradeMax,
      appliedCourseGradeMin,
      appliedCourseGradeMax,
      applyAssignmentGradeLimits,
      applyCourseGradeLimits,
      resetFilters,
    }),
    [
      assignmentType, assignment, includeCourseRoleMembers, cohort, track,
      assignmentGradeMin, assignmentGradeMax, courseGradeMin, courseGradeMax,
      searchValue,
      appliedAssignmentGradeMin, appliedAssignmentGradeMax,
      appliedCourseGradeMin, appliedCourseGradeMax,
      // Wrapped setters + apply ops are stable (useCallback []) but listed to
      // satisfy exhaustive-deps:
      setAssignmentType, setAssignment, setIncludeCourseRoleMembers, setCohort,
      setTrack, setAssignmentGradeMin, setAssignmentGradeMax, setCourseGradeMin,
      setCourseGradeMax, setSearchValue,
      applyAssignmentGradeLimits, applyCourseGradeLimits, resetFilters,
    ],
  );

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

/**
 * useFilters()
 * Accessor for the gradebook filter context. Throws if used outside a
 * <FiltersProvider>.
 */
export const useFilters = (): FiltersContextValue => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};

export default FiltersContext;
