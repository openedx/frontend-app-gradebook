import { renderHook } from '@testing-library/react';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import lms from '@src/data/services/lms';
import { useFilters } from '@src/data/filtersContext';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useCanViewGradebook } from '@src/data/apiHook';
import {
  useSelectedCohortEntry, useSelectedTrackEntry,
} from '@src/components/GradebookFilters/data/hooks';
import { useGradesData, useGradeOverrideHistory } from './apiHook';
import {
  useGradesHeadings,
  useSelectableAssignmentLabels,
  useSelectedAssignmentLabel,
  useShouldShowSpinner,
  useAllGrades,
  useUserCounts,
  useGradeData,
  useGradeExportUrl,
  useInterventionExportUrl,
  useFilterBadgeConfig,
  useGradeOverrideData,
  useEditModalPossibleGrade,
  useRefetchGrades,
  useFetchGradesIfAssignmentGradeFiltersSet,
  useFetchPrevNextGrades,
} from './hooks';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useIsMutating: jest.fn(),
  useQueryClient: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('@src/data/services/lms', () => ({
  urls: {
    gradeCsvUrl: jest.fn((args) => ({ csv: args })),
    interventionExportCsvUrl: jest.fn((args) => ({ intervention: args })),
  },
}));
jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCanViewGradebook: jest.fn(),
}));
jest.mock('@src/components/GradebookFilters/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradebookFilters/data/hooks'),
  useSelectedCohortEntry: jest.fn(),
  useSelectedTrackEntry: jest.fn(),
}));
jest.mock('./apiHook', () => ({
  useGradesData: jest.fn(),
  useGradeOverrideHistory: jest.fn(),
}));

const useIsMutatingMock = useIsMutating as unknown as jest.Mock;
const useQueryClientMock = useQueryClient as unknown as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const useFiltersMock = useFilters as unknown as jest.Mock;
const useGradebookUiMock = useGradebookUi as unknown as jest.Mock;
const useCanViewGradebookMock = useCanViewGradebook as unknown as jest.Mock;
const useSelectedCohortEntryMock = useSelectedCohortEntry as unknown as jest.Mock;
const useSelectedTrackEntryMock = useSelectedTrackEntry as unknown as jest.Mock;
const useGradesDataMock = useGradesData as unknown as jest.Mock;
const useGradeOverrideHistoryMock = useGradeOverrideHistory as unknown as jest.Mock;

const results = [{
  section_breakdown: [
    {
      label: 'HW1', subsection_name: 'Week 1', category: 'Homework', module_id: 'a1',
    },
    {
      label: 'HW2', subsection_name: 'Week 2', category: 'Homework', module_id: 'a2',
    },
    {
      label: 'E1', subsection_name: 'Midterm', category: 'Exam', module_id: 'e1',
    },
  ],
}];

const baseFilters = () => ({
  assignmentType: '',
  assignment: '',
  track: '',
  includeCourseRoleMembers: false,
  appliedAssignmentGradeMin: '0',
  appliedAssignmentGradeMax: '100',
  appliedCourseGradeMin: '0',
  appliedCourseGradeMax: '100',
});

const baseGradesData = (overrides = {}) => ({
  results,
  prevPage: 'prev-url',
  nextPage: 'next-url',
  totalUsersCount: 10,
  filteredUsersCount: 4,
  isFetching: false,
  isError: false,
  isSuccess: true,
  ...overrides,
});

const baseUi = (overrides = {}) => ({
  modalState: {
    updateModuleId: 'a1',
    updateUserId: 3,
    adjustedGradePossible: null,
  },
  gradesPageEndpoint: null,
  setGradesPageEndpoint: jest.fn(),
  gradeFormat: 'absolute',
  ...overrides,
});

describe('GradesView/data hooks', () => {
  let ui: ReturnType<typeof baseUi>;
  let invalidateQueries: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidateQueries = jest.fn();
    useQueryClientMock.mockReturnValue({ invalidateQueries });
    useParamsMock.mockReturnValue({ courseId: 'course-v1:X' });
    useIsMutatingMock.mockReturnValue(0);
    useCanViewGradebookMock.mockReturnValue(true);
    useSelectedCohortEntryMock.mockReturnValue(undefined);
    useSelectedTrackEntryMock.mockReturnValue(undefined);
    useFiltersMock.mockReturnValue(baseFilters());
    useGradesDataMock.mockReturnValue(baseGradesData());
    ui = baseUi();
    useGradebookUiMock.mockReturnValue(ui);
    useGradeOverrideHistoryMock.mockReturnValue({
      data: undefined, isError: false, error: null,
    });
  });

  describe('useGradesHeadings', () => {
    it('returns the base headings with every labeled section', () => {
      const { result } = renderHook(useGradesHeadings);
      expect(result.current).toEqual([
        'Username', 'Full Name', 'Email', 'HW1', 'HW2', 'E1', 'Total Grade (%)',
      ]);
    });

    it('filters to the selected assignmentType', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignmentType: 'Homework' });
      const { result } = renderHook(useGradesHeadings);
      expect(result.current).toEqual([
        'Username', 'Full Name', 'Email', 'HW1', 'HW2', 'Total Grade (%)',
      ]);
    });

    it('filters to the selected assignment id', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignment: 'a2' });
      const { result } = renderHook(useGradesHeadings);
      expect(result.current).toEqual([
        'Username', 'Full Name', 'Email', 'HW2', 'Total Grade (%)',
      ]);
    });
  });

  describe('useSelectableAssignmentLabels', () => {
    it('returns every assignment when no assignmentType is selected', () => {
      const { result } = renderHook(useSelectableAssignmentLabels);
      expect(result.current).toHaveLength(3);
    });

    it('narrows down by assignmentType when one is selected', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignmentType: 'Homework' });
      const { result } = renderHook(useSelectableAssignmentLabels);
      expect(result.current.map(r => r.id)).toEqual(['a1', 'a2']);
    });
  });

  describe('useSelectedAssignmentLabel', () => {
    it('returns undefined when nothing is selected', () => {
      const { result } = renderHook(useSelectedAssignmentLabel);
      expect(result.current).toBeUndefined();
    });

    it('returns the label of the selected assignment', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignment: 'e1' });
      const { result } = renderHook(useSelectedAssignmentLabel);
      expect(result.current).toBe('E1');
    });
  });

  describe('useShouldShowSpinner', () => {
    it('is false when the gradebook is gated', () => {
      useCanViewGradebookMock.mockReturnValue(false);
      useGradesDataMock.mockReturnValue(baseGradesData({ isFetching: true }));
      const { result } = renderHook(useShouldShowSpinner);
      expect(result.current).toBe(false);
    });

    it('is true while the grades query is fetching', () => {
      useGradesDataMock.mockReturnValue(baseGradesData({ isFetching: true }));
      const { result } = renderHook(useShouldShowSpinner);
      expect(result.current).toBe(true);
    });

    it('is true while a mutation is in flight', () => {
      useIsMutatingMock.mockReturnValue(1);
      const { result } = renderHook(useShouldShowSpinner);
      expect(result.current).toBe(true);
    });
  });

  describe('read-model hooks', () => {
    it('useAllGrades returns the sorted results from the grades query', () => {
      const { result } = renderHook(useAllGrades);
      expect(result.current).toBe(results);
    });

    it('useUserCounts returns the total/filtered counts', () => {
      const { result } = renderHook(useUserCounts);
      expect(result.current).toEqual({ totalUsersCount: 10, filteredUsersCount: 4 });
    });

    it('useGradeData returns pagination + counts + gradeFormat', () => {
      const { result } = renderHook(useGradeData);
      expect(result.current).toEqual({
        nextPage: 'next-url',
        prevPage: 'prev-url',
        totalUsersCount: 10,
        filteredUsersCount: 4,
        gradeFormat: 'absolute',
      });
    });
  });

  describe('export url hooks', () => {
    it('useGradeExportUrl delegates to lms.urls.gradeCsvUrl with the current args', () => {
      useSelectedCohortEntryMock.mockReturnValue({ name: 'Cohort A' });
      useFiltersMock.mockReturnValue({
        ...baseFilters(),
        track: 'verified',
        assignment: 'a1',
        assignmentType: 'Homework',
      });
      const { result } = renderHook(useGradeExportUrl);
      expect(lms.urls.gradeCsvUrl).toHaveBeenCalledWith(expect.objectContaining({
        cohort: 'Cohort A',
        track: 'verified',
        assignment: 'a1',
        assignmentType: 'Homework',
        excludedCourseRoles: 'all',
      }));
      expect(result.current).toEqual({ csv: expect.any(Object) });
    });

    it('excludedCourseRoles is empty when includeCourseRoleMembers is true', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), includeCourseRoleMembers: true });
      renderHook(useGradeExportUrl);
      expect(lms.urls.gradeCsvUrl).toHaveBeenCalledWith(
        expect.objectContaining({ excludedCourseRoles: '' }),
      );
    });

    it('useInterventionExportUrl delegates to lms.urls.interventionExportCsvUrl', () => {
      renderHook(useInterventionExportUrl);
      expect(lms.urls.interventionExportCsvUrl).toHaveBeenCalled();
    });
  });

  describe('useFilterBadgeConfig', () => {
    it('for cohort returns the cohort name and isDefault=false when set', () => {
      useSelectedCohortEntryMock.mockReturnValue({ name: 'Cohort A' });
      const { result } = renderHook(() => useFilterBadgeConfig('cohort'));
      expect(result.current.value).toBe('Cohort A');
      expect(result.current.isDefault).toBe(false);
    });

    it('for track defaults to empty string when nothing is selected', () => {
      const { result } = renderHook(() => useFilterBadgeConfig('track'));
      expect(result.current.value).toBe('');
      expect(result.current.isDefault).toBe(true);
    });

    it('for range filters (assignmentGrade) returns "min - max" and detects the default', () => {
      const { result } = renderHook(() => useFilterBadgeConfig('assignmentGrade'));
      expect(result.current.value).toBe('0 - 100');
      expect(result.current.isDefault).toBe(true);
    });

    it('for range filters detects non-default values', () => {
      useFiltersMock.mockReturnValue({
        ...baseFilters(),
        appliedCourseGradeMin: '25',
        appliedCourseGradeMax: '75',
      });
      const { result } = renderHook(() => useFilterBadgeConfig('courseGrade'));
      expect(result.current.value).toBe('25 - 75');
      expect(result.current.isDefault).toBe(false);
    });

    it('for single-value filters (assignmentType) returns the current value', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignmentType: 'Homework' });
      const { result } = renderHook(() => useFilterBadgeConfig('assignmentType'));
      expect(result.current.value).toBe('Homework');
      expect(result.current.isDefault).toBe(false);
    });

    it('for the assignment filter uses the selected assignment label', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), assignment: 'a1' });
      const { result } = renderHook(() => useFilterBadgeConfig('assignment'));
      expect(result.current.value).toBe('HW1');
    });

    it('for includeCourseRoleMembers uses the boolean value', () => {
      useFiltersMock.mockReturnValue({ ...baseFilters(), includeCourseRoleMembers: true });
      const { result } = renderHook(() => useFilterBadgeConfig('includeCourseRoleMembers'));
      expect(result.current.value).toBe(true);
      expect(result.current.isDefault).toBe(false);
    });
  });

  describe('useGradeOverrideData', () => {
    it('returns defaults while the query has no data', () => {
      const { result } = renderHook(useGradeOverrideData);
      expect(result.current).toEqual({
        gradeOverrideHistoryResults: [],
        gradeOverrideCurrentEarnedGradedOverride: null,
        gradeOriginalEarnedGraded: null,
        gradeOriginalPossibleGraded: null,
        gradeOverrideHistoryError: '',
        hasOverrideErrors: false,
      });
    });

    it('shapes the query data into the read model', () => {
      useGradeOverrideHistoryMock.mockReturnValue({
        data: {
          overrideHistory: [{ id: 1 }],
          currentEarnedGradedOverride: 9,
          originalGradeEarnedGraded: 7,
          originalGradePossibleGraded: 10,
        },
        isError: false,
        error: null,
      });
      const { result } = renderHook(useGradeOverrideData);
      expect(result.current).toMatchObject({
        gradeOverrideHistoryResults: [{ id: 1 }],
        gradeOverrideCurrentEarnedGradedOverride: 9,
        gradeOriginalEarnedGraded: 7,
        gradeOriginalPossibleGraded: 10,
      });
    });

    it('surfaces the query error message when the query errored', () => {
      useGradeOverrideHistoryMock.mockReturnValue({
        data: undefined, isError: true, error: new Error('boom'),
      });
      const { result } = renderHook(useGradeOverrideData);
      expect(result.current.hasOverrideErrors).toBe(true);
      expect(result.current.gradeOverrideHistoryError).toBe('boom');
    });
  });

  describe('useEditModalPossibleGrade', () => {
    it('prefers the context adjustedGradePossible when set', () => {
      useGradebookUiMock.mockReturnValue(baseUi({
        modalState: { updateModuleId: 'a1', updateUserId: 3, adjustedGradePossible: 20 },
      }));
      const { result } = renderHook(useEditModalPossibleGrade);
      expect(result.current).toBe(20);
    });

    it('falls back to the query original possible-graded value', () => {
      useGradeOverrideHistoryMock.mockReturnValue({
        data: { originalGradePossibleGraded: 15 }, isError: false, error: null,
      });
      const { result } = renderHook(useEditModalPossibleGrade);
      expect(result.current).toBe(15);
    });
  });

  describe('useRefetchGrades', () => {
    it('clears the page cursor when one is set', () => {
      const setGradesPageEndpoint = jest.fn();
      useGradebookUiMock.mockReturnValue(baseUi({
        gradesPageEndpoint: 'https://lms/next', setGradesPageEndpoint,
      }));
      const { result } = renderHook(useRefetchGrades);
      result.current();
      expect(setGradesPageEndpoint).toHaveBeenCalledWith(null);
      expect(invalidateQueries).not.toHaveBeenCalled();
    });

    it('invalidates the grades query when already on the base page', () => {
      const { result } = renderHook(useRefetchGrades);
      result.current();
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining(['course-v1:X', 'grades']),
      });
    });
  });

  describe('useFetchGradesIfAssignmentGradeFiltersSet', () => {
    it('does not refetch when the applied grade filters are at their defaults', () => {
      const { result } = renderHook(useFetchGradesIfAssignmentGradeFiltersSet);
      result.current();
      expect(invalidateQueries).not.toHaveBeenCalled();
    });

    it('refetches when at least one applied grade filter differs from the default', () => {
      useFiltersMock.mockReturnValue({
        ...baseFilters(), appliedAssignmentGradeMin: '25',
      });
      const { result } = renderHook(useFetchGradesIfAssignmentGradeFiltersSet);
      result.current();
      expect(invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useFetchPrevNextGrades', () => {
    it('sets the page cursor on the GradebookUi context', () => {
      const setGradesPageEndpoint = jest.fn();
      useGradebookUiMock.mockReturnValue(baseUi({ setGradesPageEndpoint }));
      const { result } = renderHook(useFetchPrevNextGrades);
      result.current('https://lms/next?page=3');
      expect(setGradesPageEndpoint).toHaveBeenCalledWith('https://lms/next?page=3');
    });
  });
});
