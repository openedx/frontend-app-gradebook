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
    const result = selectors.bulkImportError({ grades: { bulkManagement: { errorMessages: ['It\'s over 9000', 'Neutrino-triggered bit flips'] } } });
    expect(result).toEqual('Errors while processing: It\'s over 9000, Neutrino-triggered bit flips');
  });
});

describe('grade formatters', () => {
  const selectedAssignment = { assignmentId: 'block-v1:edX+type@sequential+block@abcde' };

  describe('formatMinAssignmentGrade', () => {
    it('passes numbers through grade has been modified and assignment is supplied', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade('1', selectedAssignment);
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade('99', selectedAssignment);
      const formattedMinGrade = selectors.formatMinCourseGrade('37', selectedAssignment);
      const formattedMaxGrade = selectors.formatMaxCourseGrade('42', selectedAssignment);

      expect(formattedMinAssignmentGrade).toEqual('1');
      expect(formattedMaxAssignmentGrade).toEqual('99');
      expect(formattedMinGrade).toEqual('37');
      expect(formattedMaxGrade).toEqual('42');
    });
    it('ignores unmodified grades', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade('0', selectedAssignment);
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade('100', selectedAssignment);
      const formattedMinGrade = selectors.formatMinCourseGrade('0', selectedAssignment);
      const formattedMaxGrade = selectors.formatMaxCourseGrade('100', selectedAssignment);

      expect(formattedMinAssignmentGrade).toEqual(null);
      expect(formattedMaxAssignmentGrade).toEqual(null);
      expect(formattedMinGrade).toEqual(null);
      expect(formattedMaxGrade).toEqual(null);
    });
    it('ignores grade when an assignment is not supplied', () => {
      const formattedMinAssignmentGrade = selectors.formatMinAssignmentGrade('0', {});
      const formattedMaxAssignmentGrade = selectors.formatMaxAssignmentGrade('100', {});
      const formattedMinGrade = selectors.formatMinCourseGrade('0', {});
      const formattedMaxGrade = selectors.formatMaxCourseGrade('100', {});

      expect(formattedMinAssignmentGrade).toEqual(null);
      expect(formattedMaxAssignmentGrade).toEqual(null);
      expect(formattedMinGrade).toEqual(null);
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
  const allSubsectionLabels = ['HW 01', 'HW 02', 'Lab 01'];
  const expectedHeaders = (subsectionLabels) => (['Username', 'Email', ...subsectionLabels, 'Total Grade (%)']);

  it('creates headers for all assignments when no filtering is applied', () => {
    const headingMapper = selectors.headingMapper('All');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(allSubsectionLabels));
  });
  it('creates headers for only matching assignment types when type filter is applied', () => {
    const headingMapper = selectors.headingMapper('Homework');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(['HW 01', 'HW 02']));
  });
  it('creates headers for only matching assignment when label filter is applied', () => {
    const headingMapper = selectors.headingMapper('Homework', 'HW 02');
    const headers = headingMapper(genericResultsRows);
    expect(headers).toEqual(expectedHeaders(['HW 02']));
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
    // the selector factory is already tested, this just exercises some of these mappings
    expect(selectors.filteredUsersCount(simpleSelectorState)).toEqual(9000);
    expect(selectors.totalUsersCount(simpleSelectorState)).toEqual(9001);
    expect(selectors.gradeFormat(simpleSelectorState)).toEqual('percent');
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
