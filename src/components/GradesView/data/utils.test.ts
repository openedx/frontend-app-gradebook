import {
  minGrade,
  maxGrade,
  formatMaxCourseGrade,
  formatMinCourseGrade,
  formatMaxAssignmentGrade,
  formatMinAssignmentGrade,
  roundGrade,
  subsectionGrade,
  formatGradeOverrideForDisplay,
  headingMapper,
  getAssignmentsFromResultsSubstate,
  chooseRelevantAssignmentData,
  relevantAssignmentDataFromResults,
  isDefault,
  buildGradesFetchParams,
} from './utils';

jest.mock('@src/i18n/utils', () => ({
  ...jest.requireActual('@src/i18n/utils'),
  getLocalizedSlash: () => '/',
}));
jest.mock('@src/data/formatUtils', () => ({
  ...jest.requireActual('@src/data/formatUtils'),
  formatDateForDisplay: (d: Date) => `formatted(${d.toISOString()})`,
}));

describe('GradesView/data utils', () => {
  describe('grade limit formatters', () => {
    it('formatMaxCourseGrade collapses to null at the max, keeps other values', () => {
      expect(formatMaxCourseGrade(maxGrade)).toBeNull();
      expect(formatMaxCourseGrade('80')).toBe('80');
    });

    it('formatMinCourseGrade collapses to null at the min, keeps other values', () => {
      expect(formatMinCourseGrade(minGrade)).toBeNull();
      expect(formatMinCourseGrade('20')).toBe('20');
    });

    it('formatMaxAssignmentGrade collapses to null at max or when no assignment', () => {
      expect(formatMaxAssignmentGrade(maxGrade, { assignmentId: 'a1' })).toBeNull();
      expect(formatMaxAssignmentGrade('80', { assignmentId: undefined })).toBeNull();
      expect(formatMaxAssignmentGrade('80', { assignmentId: 'a1' })).toBe('80');
    });

    it('formatMinAssignmentGrade collapses to null at min or when no assignment', () => {
      expect(formatMinAssignmentGrade(minGrade, { assignmentId: 'a1' })).toBeNull();
      expect(formatMinAssignmentGrade('20', { assignmentId: undefined })).toBeNull();
      expect(formatMinAssignmentGrade('20', { assignmentId: 'a1' })).toBe('20');
    });
  });

  describe('roundGrade', () => {
    it('rounds to two decimals', () => {
      expect(roundGrade(1.239)).toBe(1.24);
    });
    it('defaults null/undefined to 0', () => {
      expect(roundGrade(null)).toBe(0);
      expect(roundGrade(undefined)).toBe(0);
    });
  });

  describe('subsectionGrade', () => {
    it('formats absolute as earned/possible when attempted', () => {
      expect(subsectionGrade.absolute({
        score_earned: 4.5, score_possible: 6, attempted: true,
      })).toBe('4.5/6');
    });
    it('formats absolute as earned only when not attempted', () => {
      expect(subsectionGrade.absolute({
        score_earned: 0, score_possible: 6, attempted: false,
      })).toBe('0');
    });
    it('formats percent as rounded percent * 100', () => {
      expect(subsectionGrade.percent({ percent: 0.876 })).toBe(87.6);
      expect(subsectionGrade.percent({ percent: undefined })).toBe(0);
    });
  });

  describe('formatGradeOverrideForDisplay', () => {
    it('reshapes the raw override history entries', () => {
      const rows = formatGradeOverrideForDisplay([{
        history_date: '2024-01-02T03:04:05Z',
        history_user: 'grader-1',
        override_reason: 'late',
        earned_graded_override: 9,
      }]);
      expect(rows).toEqual([{
        date: expect.stringContaining('formatted('),
        grader: 'grader-1',
        reason: 'late',
        adjustedGrade: 9,
      }]);
    });
  });

  describe('headingMapper', () => {
    const entries = [
      { label: 'HW1', category: 'Homework' },
      { label: 'HW2', category: 'Homework' },
      { label: 'E1', category: 'Exam' },
      { category: 'Homework' /* no label — filtered out */ },
    ];

    it('returns [] when the entry is null/undefined', () => {
      expect(headingMapper('All')(null)).toEqual([]);
      expect(headingMapper('All')(undefined)).toEqual([]);
    });

    it('with category=All and label=All returns every labeled entry', () => {
      const headers = headingMapper('All')(entries);
      expect(headers).toEqual([
        'Username', 'Full Name', 'Email', 'HW1', 'HW2', 'E1', 'Total Grade (%)',
      ]);
    });

    it('filters by category when a category (not All) is given', () => {
      const headers = headingMapper('Homework')(entries);
      expect(headers).toEqual([
        'Username', 'Full Name', 'Email', 'HW1', 'HW2', 'Total Grade (%)',
      ]);
    });

    it('filters by label when a label (not All) is given', () => {
      const headers = headingMapper('Homework', 'HW1')(entries);
      expect(headers).toEqual([
        'Username', 'Full Name', 'Email', 'HW1', 'Total Grade (%)',
      ]);
    });
  });

  describe('assignment lookups', () => {
    const results = [{
      section_breakdown: [
        {
          label: 'HW1', subsection_name: 'Week 1', category: 'Homework', module_id: 'a1',
        },
        {
          label: 'E1', subsection_name: 'Midterm', category: 'Exam', module_id: 'a2',
        },
      ],
    }];

    it('getAssignmentsFromResultsSubstate returns the first row section breakdown', () => {
      expect(getAssignmentsFromResultsSubstate(results)).toHaveLength(2);
    });

    it('getAssignmentsFromResultsSubstate returns [] for empty results', () => {
      expect(getAssignmentsFromResultsSubstate([])).toEqual([]);
    });

    it('chooseRelevantAssignmentData reshapes a section breakdown entry', () => {
      expect(chooseRelevantAssignmentData(results[0].section_breakdown[0])).toEqual({
        label: 'HW1', subsectionLabel: 'Week 1', type: 'Homework', id: 'a1',
      });
    });

    it('relevantAssignmentDataFromResults finds the assignment by id', () => {
      expect(relevantAssignmentDataFromResults(results, 'a2')).toEqual({
        label: 'E1', subsectionLabel: 'Midterm', type: 'Exam', id: 'a2',
      });
    });

    it('relevantAssignmentDataFromResults returns undefined for unknown id', () => {
      expect(relevantAssignmentDataFromResults(results, 'nope')).toBeUndefined();
    });
  });

  describe('isDefault', () => {
    it('is true when the value equals the initial filter value', () => {
      expect(isDefault('assignmentGradeMax', '100')).toBe(true);
      expect(isDefault('includeCourseRoleMembers', false)).toBe(true);
    });
    it('is false when the value differs', () => {
      expect(isDefault('assignmentGradeMax', '80')).toBe(false);
    });
  });

  describe('buildGradesFetchParams', () => {
    const baseSnapshot = {
      assignment: '',
      assignmentGradeMin: '0',
      assignmentGradeMax: '100',
      courseGradeMin: '0',
      courseGradeMax: '100',
      cohort: 'cohort-a',
      track: 'verified',
      includeCourseRoleMembers: false,
      searchValue: '',
    };

    it('collapses all limits to null at the defaults', () => {
      const params = buildGradesFetchParams(baseSnapshot);
      expect(params).toEqual({
        searchText: null,
        cohort: 'cohort-a',
        track: 'verified',
        options: {
          assignment: undefined,
          includeCourseRoleMembers: false,
          assignmentGradeMax: null,
          assignmentGradeMin: null,
          courseGradeMax: null,
          courseGradeMin: null,
        },
      });
    });

    it('keeps assignment limits when an assignment is selected and value is not at the boundary', () => {
      const params = buildGradesFetchParams({
        ...baseSnapshot,
        assignment: 'a1',
        assignmentGradeMin: '10',
        assignmentGradeMax: '90',
      });
      expect(params.options).toMatchObject({
        assignment: 'a1',
        assignmentGradeMin: '10',
        assignmentGradeMax: '90',
      });
    });

    it('keeps course limits when the value is not at the boundary', () => {
      const params = buildGradesFetchParams({
        ...baseSnapshot,
        courseGradeMin: '25',
        courseGradeMax: '75',
      });
      expect(params.options.courseGradeMin).toBe('25');
      expect(params.options.courseGradeMax).toBe('75');
    });

    it('propagates searchValue into options.searchText and top-level searchText', () => {
      const params = buildGradesFetchParams({ ...baseSnapshot, searchValue: 'abc' });
      expect(params.searchText).toBe('abc');
      expect(params.options.searchText).toBe('abc');
    });
  });
});
