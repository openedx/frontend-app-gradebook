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
