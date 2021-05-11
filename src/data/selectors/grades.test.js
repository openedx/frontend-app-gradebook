import selectors from './grades';

const genericHistoryRow = {
  id: 5,
  class_name: 'bulk_grades.api.GradeCSVProcessor',
  unique_id: 'course-v1:google+goog101+2018_spring',
  operation: 'commit',
  user: 'edx',
  modified: '2019-07-16T20:25:46.700802Z',
  original_filename: '',
  data: {
    total_rows: 5,
    processed_rows: 3,
    saved_rows: 3,
  },
};

const genericResultsRows = [
  {
    attempted: true,
    category: 'Homework',
    label: 'HW 01',
    module_id: 'block-v1:edX+Term+type@sequential+block@1',
    percent: 1,
    score_earned: 1,
    score_possible: 1,
    subsection_name: 'Week 1',
  },
  {
    attempted: true,
    category: 'Homework',
    label: 'HW 02',
    module_id: 'block-v1:edX+Term+type@sequential+block@2',
    percent: 1,
    score_earned: 1,
    score_possible: 1,
    subsection_name: 'Week 2',
  },
  {
    attempted: false,
    category: 'Lab',
    label: 'Lab 01',
    module_id: 'block-v1:edX+Term+type@sequential+block@3',
    percent: 0,
    score_earned: 0,
    score_possible: 0,
    subsection_name: 'Week 3',
  },
];

describe('bulkImportError', () => {
  it('returns an empty string when bulkManagement not run', () => {
    const result = selectors.bulkImportError({ grades: { bulkManagement: null } });
    expect(result).toEqual('');
  });

  it('returns an empty string when bulkManagement runs without error', () => {
    const result = selectors.bulkImportError({ grades: { bulkManagement: { uploadSuccess: true } } });
    expect(result).toEqual('');
  });

  it('returns error string when bulkManagement encounters an error', () => {
    const errorMessages = ['error1', 'also error2'];
    const expectedErrorString = `Errors while processing: ${errorMessages[0]}, ${errorMessages[1]}`;
    const result = selectors.bulkImportError({ grades: { bulkManagement: { errorMessages } } });
    expect(result).toEqual(expectedErrorString);
  });
});

describe('grade formatters', () => {
  const selectedAssignment = { assignmentId: 'block-v1:edX+type@sequential+block@abcde' };

  describe('formatMinAssignmentGrade', () => {
    const defaultGrade = '0';
    const modifiedGrade = '1';

    it('passes numbers through when grade is not default (0) and assignment is supplied', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade(modifiedGrade, selectedAssignment);
      expect(formattedMinAssignmentGrade).toEqual(modifiedGrade);
    });
    it('ignores grade when unmodified from default (0)', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade(defaultGrade, selectedAssignment);
      expect(formattedMinAssignmentGrade).toEqual(null);
    });
    it('ignores grade when an assignment is not supplied', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade(modifiedGrade, {});
      expect(formattedMinAssignmentGrade).toEqual(null);
    });
  });

  describe('formatMaxAssignmentGrade', () => {
    const defaultGrade = '100';
    const modifiedGrade = '99';

    it('passes numbers through when grade is not default (100) and assignment is supplied', () => {
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade(modifiedGrade, selectedAssignment);
      expect(formattedMaxAssignmentGrade).toEqual(modifiedGrade);
    });
    it('ignores grade when unmodified from default (100)', () => {
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade(defaultGrade, selectedAssignment);
      expect(formattedMaxAssignmentGrade).toEqual(null);
    });
    it('ignores grade when an assignment is not supplied', () => {
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade(modifiedGrade, {});
      expect(formattedMaxAssignmentGrade).toEqual(null);
    });
  });

  describe('formatMinCourseGrade', () => {
    const defaultGrade = '0';
    const modifiedGrade = '37';

    it('passes numbers through when grade is not default (0) and assignment is supplied', () => {
      const formattedMinGrade = selectors.formatMinCourseGrade(modifiedGrade, selectedAssignment);
      expect(formattedMinGrade).toEqual(modifiedGrade);
    });
    it('ignores grade when unmodified from default (0)', () => {
      const formattedMinGrade = selectors.formatMinCourseGrade(defaultGrade, selectedAssignment);
      expect(formattedMinGrade).toEqual(null);
    });
  });

  describe('formatMaxCourseGrade', () => {
    const defaultGrade = '100';
    const modifiedGrade = '42';

    it('passes numbers through when grade is not default (100) and assignment is supplied', () => {
      const formattedMaxGrade = selectors.formatMaxCourseGrade(modifiedGrade, selectedAssignment);
      expect(formattedMaxGrade).toEqual(modifiedGrade);
    });
    it('ignores unmodified grades', () => {
      const formattedMaxGrade = selectors.formatMaxCourseGrade(defaultGrade, selectedAssignment);
      expect(formattedMaxGrade).toEqual(null);
    });
  });
});

describe('getExampleSectionBreakdown', () => {
  const gradesData = {
    next: null,
    previous: null,
    results: [
      {
        section_breakdown: [
          {
            subsection_name: 'Example Week 1: Getting Started',
            score_earned: 1,
            score_possible: 1,
            percent: 1,
            displayed_value: '1.00',
            grade_description: '(0.00/0.00)',
          },
        ],
      },
    ],
  };

  it('returns an empty array when results are unavailable', () => {
    const result = selectors.getExampleSectionBreakdown({ grades: { results: [{}] } });
    expect(result).toEqual([]);
  });

  it('returns an empty array when breakdowns are unavailable', () => {
    const result = selectors.getExampleSectionBreakdown({ grades: { results: [{ foo: 'bar' }] } });
    expect(result).toEqual([]);
  });

  it('gets section breakdown when available', () => {
    const result = selectors.getExampleSectionBreakdown({ grades: gradesData });
    expect(result).toEqual([{
      subsection_name: 'Example Week 1: Getting Started',
      score_earned: 1,
      score_possible: 1,
      percent: 1,
      displayed_value: '1.00',
      grade_description: '(0.00/0.00)',
    }]);
  });
});

describe('headingMapper', () => {
  const expectedHeaders = (subsectionLabels) => (['Username', 'Email', ...subsectionLabels, 'Total Grade (%)']);

  it('creates headers for all assignments when no filtering is applied', () => {
    const allSubsectionLabels = ['HW 01', 'HW 02', 'Lab 01'];
    const headingMapper = selectors.headingMapper('All');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(allSubsectionLabels));
  });
  it('creates headers for only matching assignment types when type filter is applied', () => {
    const homeworkHeaders = ['HW 01', 'HW 02'];
    const headingMapper = selectors.headingMapper('Homework');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(homeworkHeaders));
  });
  it('creates headers for only matching assignment when label filter is applied', () => {
    const homeworkHeader = ['HW 02'];
    const headingMapper = selectors.headingMapper('Homework', 'HW 02');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(homeworkHeader));
  });
  it('returns an empty array when no entries are passed', () => {
    const headingMapper = selectors.headingMapper('All');
    const headers = headingMapper(undefined);
    expect(headers).toEqual([]);
  });
});

describe('simpleSelectors', () => {
  const simpleSelectorState = {
    grades: {
      filteredUsersCount: 9000,
      totalUsersCount: 9001,
      gradeFormat: 'percent',
      showSpinner: false,
      gradeOverrideCurrentEarnedGradedOverride: null,
      gradeOverrideHistoryError: null,
      gradeOriginalEarnedGraded: null,
      gradeOriginalPossibleGraded: null,
      showSuccess: false,
    },
  };

  it('selects simple data by name from grades state', () => {
    const expectedFilteredUsers = 9000;
    const expectedTotalUsers = 9001;
    const expectedGradeFormat = 'percent';

    // the selector factory is already tested, this just exercises some of these mappings
    expect(selectors.filteredUsersCount(simpleSelectorState)).toEqual(expectedFilteredUsers);
    expect(selectors.totalUsersCount(simpleSelectorState)).toEqual(expectedTotalUsers);
    expect(selectors.gradeFormat(simpleSelectorState)).toEqual(expectedGradeFormat);
  });
});

describe('uploadSuccess', () => {
  it('shows an upload success when bulk management data returned and completed successfully', () => {
    const uploadSuccess = selectors.uploadSuccess({ grades: { bulkManagement: { uploadSuccess: true } } });
    expect(uploadSuccess).toEqual(true);
  });
  it('returns false when bulk management data not returned', () => {
    const uploadSuccess = selectors.uploadSuccess({ grades: {} });
    expect(uploadSuccess).toEqual(false);
  });
});

describe('bulkManagementHistoryEntries', () => {
  it('handles history being as-yet unloaded', () => {
    const result = selectors.bulkManagementHistoryEntries({ grades: { bulkManagement: {} } });
    expect(result).toEqual([]);
  });

  it('formats dates for us', () => {
    const result = selectors.bulkManagementHistoryEntries({
      grades: {
        bulkManagement: {
          history: [
            genericHistoryRow,
          ],
        },
      },
    });
    const [{ timeUploaded }] = result;
    expect(timeUploaded).not.toMatch(/Z$/);
    expect(timeUploaded).toContain(' at ');
  });

  const exerciseGetRowsProcessed = (input, expectation) => {
    const result = selectors.bulkManagementHistoryEntries({
      grades: {
        bulkManagement: {
          history: [
            { ...genericHistoryRow, data: input },
          ],
        },
      },
    });
    const [{ summaryOfRowsProcessed }] = result;
    expect(summaryOfRowsProcessed).toEqual(expect.objectContaining(expectation));
  };

  it('calculates skipped rows', () => {
    exerciseGetRowsProcessed({
      total_rows: 100,
      processed_rows: 10,
      saved_rows: 10,
    }, {
      skipped: 90,
    });
  });

  it('calculates failures', () => {
    exerciseGetRowsProcessed({
      total_rows: 10,
      processed_rows: 100,
      saved_rows: 10,
    }, {
      failed: 90,
    });
  });
});
