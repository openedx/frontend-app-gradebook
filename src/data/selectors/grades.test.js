import { EMAIL_HEADING, TOTAL_COURSE_GRADE_HEADING, USERNAME_HEADING } from '../constants/grades';
import { formatDateForDisplay } from '../actions/utils';
import * as selectors from './grades';
import exportedSelectors from './grades';

const { minGrade, maxGrade } = selectors;

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

describe('grades selectors', () => {
  // Transformers
  describe('getRowsProcessed', () => {
    test('returns appropriate breakdown of processed rows given some saved and skipped', () => {
      const data = {
        processed_rows: 20,
        saved_rows: 10,
        total_rows: 50,
      };
      const failed = data.processed_rows - data.saved_rows;
      const skipped = data.total_rows - data.processed_rows;
      const expected = [
        `${data.total_rows} Students: ${data.saved_rows} processed`,
        `${skipped} skipped`,
        `${failed} failed`,
      ].join(', ');
      expect(selectors.getRowsProcessed(data)).toEqual(expected);
    });
    test('excludes skipped if all rows were processed', () => {
      const data = {
        processed_rows: 50,
        saved_rows: 20,
        total_rows: 50,
      };
      const failed = data.processed_rows - data.saved_rows;
      const expected = [
        `${data.total_rows} Students: ${data.saved_rows} processed`,
        `${failed} failed`,
      ].join(', ');
      expect(selectors.getRowsProcessed(data)).toEqual(expected);
    });
    test('excludes failed if all processed rows were saved', () => {
      const data = {
        processed_rows: 20,
        saved_rows: 20,
        total_rows: 50,
      };
      const skipped = data.total_rows - data.processed_rows;
      const expected = [
        `${data.total_rows} Students: ${data.saved_rows} processed`,
        `${skipped} skipped`,
      ].join(', ');
      expect(selectors.getRowsProcessed(data)).toEqual(expected);
    });
  });

  describe('grade formatters', () => {
    const selectedAssignment = { assignmentId: 'block-v1:edX+type@sequential+block@abcde' };

    describe('formatGradeOverrideForDisplay', () => {
      it('maps history entries with formatted date, grader, reason, and adjusted grade', () => {
        const historyArray = [
          {
            history_date: 'Jan 01 2021',
            history_user: 'Grog',
            override_reason: 'rage',
            earned_graded_override: 0,
          },
          {
            history_date: 'Jan 02 2021',
            history_user: 'Keyleth',
            override_reason: 'nature',
            earned_graded_override: 10,
          },
          {
            history_date: 'Jan 03 2021',
            history_user: 'Pike',
            override_reason: 'Sarenrae',
            earned_graded_override: 9001,
          },
        ];
        const mapped = selectors.formatGradeOverrideForDisplay(historyArray);
        const testEntry = (index) => {
          const entry = historyArray[index];
          expect(mapped[index]).toEqual({
            date: formatDateForDisplay(new Date(entry.history_date)),
            grader: entry.history_user,
            reason: entry.override_reason,
            adjustedGrade: entry.earned_graded_override,
          });
        };
        testEntry(0);
        testEntry(1);
        testEntry(2);
      });
    });

    describe('formatMinAssignmentGrade', () => {
      const modifiedGrade = '1';
      const selector = selectors.formatMinAssignmentGrade;
      it('passes grade through when not min (0) and assignment is supplied', () => {
        expect(selector(modifiedGrade, selectedAssignment)).toEqual(modifiedGrade);
      });
      it('returns null for min grade', () => {
        expect(selector(minGrade, selectedAssignment)).toEqual(null);
      });
      it('returns null when assignment is not supplied', () => {
        expect(selector(modifiedGrade, {})).toEqual(null);
      });
    });

    describe('formatMaxAssignmentGrade', () => {
      const modifiedGrade = '99';
      const selector = selectors.formatMaxAssignmentGrade;
      it('passes grade through when not max (100) and assignment is supplied', () => {
        expect(selector(modifiedGrade, selectedAssignment)).toEqual(modifiedGrade);
      });
      it('returns null for max grade', () => {
        expect(selector(maxGrade, selectedAssignment)).toEqual(null);
      });
      it('returns null when assignment is not supplied', () => {
        expect(selector(modifiedGrade, {})).toEqual(null);
      });
    });

    describe('formatMinCourseGrade', () => {
      const modifiedGrade = '37';
      const selector = selectors.formatMinCourseGrade;
      it('passes grades through when not min (0) and assignment is supplied', () => {
        expect(selector(modifiedGrade, selectedAssignment)).toEqual(modifiedGrade);
      });
      it('returns null for min grade', () => {
        expect(selector(minGrade, selectedAssignment)).toEqual(null);
      });
    });

    describe('formatMaxCourseGrade', () => {
      const modifiedGrade = '42';
      const selector = selectors.formatMaxCourseGrade;
      it('passes grades through when not max and assignment is supplied', () => {
        expect(selector(modifiedGrade, selectedAssignment)).toEqual(modifiedGrade);
      });
      it('returns null for max grade', () => {
        expect(selector(maxGrade, selectedAssignment)).toEqual(null);
      });
    });
  });

  describe('headingMapper', () => {
    const expectedHeaders = (subsectionLabels) => ([
      USERNAME_HEADING,
      EMAIL_HEADING,
      ...subsectionLabels,
      TOTAL_COURSE_GRADE_HEADING,
    ]);

    const rows = genericResultsRows;
    const selector = selectors.headingMapper;
    it('creates headers for all assignments when no filtering is applied', () => {
      expect(selector('All')(genericResultsRows)).toEqual(
        expectedHeaders([rows[0].label, rows[1].label, rows[2].label]),
      );
    });
    it('creates headers for only matching assignment types when type filter is applied', () => {
      expect(
        selector('Homework')(genericResultsRows),
      ).toEqual(
        expectedHeaders([rows[0].label, rows[1].label]),
      );
    });
    it('creates headers for only matching assignment when label filter is applied', () => {
      expect(selector('Homework', rows[1].label)(rows)).toEqual(
        expectedHeaders([rows[1].label]),
      );
    });
    it('returns an empty array when no entries are passed', () => {
      expect(selector('all')(undefined)).toEqual([]);
    });
  });

  describe('transformHistoryEntry', () => {
    let getRowsProcessed;
    let output;
    const rowsProcessed = ['some', 'fake', 'rows'];
    const rawEntry = {
      modified: 'Jan 10 2021',
      original_filename: 'fileName',
      unique_id: 'I exist',
      id: 'a row/entry id, I guess',
      data: { some: 'data' },
      also: 'some',
      other: 'fields',
    };
    beforeEach(() => {
      getRowsProcessed = selectors.getRowsProcessed;
      selectors.getRowsProcessed = jest.fn(data => ({ data, rowsProcessed }));
      output = selectors.transformHistoryEntry(rawEntry);
    });
    afterEach(() => {
      selectors.getRowsProcessed = getRowsProcessed;
    });
    it('transforms modified into timeUploaded', () => {
      expect(output.timeUploaded).toEqual(formatDateForDisplay(new Date(rawEntry.modified)));
    });
    it('forwards filename', () => {
      expect(output.originalFilename).toEqual(rawEntry.original_filename);
    });
    it('summarizes processed rows', () => {
      expect(output.resultsSummary).toEqual({
        text: selectors.getRowsProcessed(rawEntry.data),
        rowId: rawEntry.id,
      });
    });
  });

  describe('roundGrade', () => {
    it('rounds values to 2 places', () => {
      expect(selectors.roundGrade(23.124)).toEqual(23.12);
    });
    it('defaults to 0 if no value is passed', () => {
      expect(selectors.roundGrade()).toEqual(0);
    });
  });

  describe('subsectionGrade', () => {
    const { roundGrade } = selectors;
    beforeEach(() => {
      selectors.roundGrade = jest.fn(grade => ({ roundGrade: grade }));
    });
    afterEach(() => {
      selectors.roundGrade = roundGrade;
    });
    describe('absolute', () => {
      const subsection = { score_earned: 2, score_possible: 5 };
      describe('attempted', () => {
        it('returns rounded {earned}/{possible}', () => {
          const earned = selectors.roundGrade(subsection.score_earned);
          const possible = selectors.roundGrade(subsection.score_possible);
          expect(
            selectors.subsectionGrade.absolute({ ...subsection, attempted: true }),
          ).toEqual(`${earned}/${possible}`);
        });
      });
      describe('not attempted', () => {
        it('returns rounded {earned}', () => {
          const earned = selectors.roundGrade(subsection.score_earned);
          expect(selectors.subsectionGrade.absolute(subsection)).toEqual(`${earned}`);
        });
      });
    });
    describe('percent', () => {
      it('returns rounded grade.percent * 100', () => {
        const percent = 42;
        const expected = selectors.roundGrade(percent * 100);
        expect(selectors.subsectionGrade.percent({ percent })).toEqual(expected);
      });
    });
  });

  // Selectors
  describe('allGrades', () => {
    it('returns the grades results from redux state', () => {
      const results = ['some', 'fake', 'results'];
      expect(selectors.allGrades({ grades: { results } })).toEqual(results);
    });
  });

  describe('bulkImportError', () => {
    it('returns an empty string when bulkManagement not run', () => {
      expect(
        selectors.bulkImportError({ grades: { bulkManagement: null } }),
      ).toEqual('');
    });

    it('returns an empty string when bulkManagement runs without error', () => {
      expect(
        selectors.bulkImportError({ grades: { bulkManagement: { uploadSuccess: true } } }),
      ).toEqual('');
    });

    it('returns error string when bulkManagement encounters an error', () => {
      const errorMessages = ['error1', 'also error2'];
      expect(
        selectors.bulkImportError({ grades: { bulkManagement: { errorMessages } } }),
      ).toEqual(
        `Errors while processing: ${errorMessages[0]}; ${errorMessages[1]};`,
      );
    });
  });

  describe('bulkManagementHistory', () => {
    const selector = selectors.bulkManagementHistory;
    it('returns history entries from grades.bulkManagement in redux store', () => {
      const history = ['a', 'few', 'history', 'entries'];
      expect(
        selector({ grades: { bulkManagement: { history } } }),
      ).toEqual(history);
    });
    it('returns an empty list if not set', () => {
      expect(
        selector({ grades: { bulkManagement: {} } }),
      ).toEqual([]);
    });
  });

  describe('bulkManagementHistoryEntries', () => {
    let bulkManagementHistory;
    let transformHistoryEntry;
    const listFn = (state) => state.entries;
    const mapFn = (entry) => ([entry]);
    const entries = ['some', 'entries', 'for', 'testing'];
    beforeEach(() => {
      bulkManagementHistory = selectors.bulkManagementHistory;
      transformHistoryEntry = selectors.transformHistoryEntry;
      selectors.bulkManagementHistory = jest.fn(listFn);
      selectors.transformHistoryEntry = jest.fn(mapFn);
    });
    afterEach(() => {
      selectors.bulkManagementHistory = bulkManagementHistory;
      selectors.transformHistoryEntry = transformHistoryEntry;
    });
    it('returns history entries mapped to transformer', () => {
      expect(
        selectors.bulkManagementHistoryEntries({ entries }),
      ).toEqual(entries.map(mapFn));
    });
  });

  describe('getExampleSectionBreakdown', () => {
    const selector = selectors.getExampleSectionBreakdown;
    it('returns an empty array when results are unavailable', () => {
      expect(selector({ grades: { results: [] } })).toEqual([]);
    });
    it('returns an empty array when breakdowns are unavailable', () => {
      expect(selector({ grades: { results: [{ foo: 'bar' }] } })).toEqual([]);
    });
    it('gets section breakdown when available', () => {
      const sectionBreakdown = { fake: 'section', breakdown: 'data' };
      expect(
        selector({ grades: { results: [{ section_breakdown: sectionBreakdown }] } }),
      ).toEqual(sectionBreakdown);
    });
  });

  describe('gradeOverrides', () => {
    it('returns grades.gradeOverrideHistoryResults from redux state', () => {
      const testVal = 'Temp Test VALUE';
      expect(
        selectors.gradeOverrides({ grades: { gradeOverrideHistoryResults: testVal } }),
      ).toEqual(testVal);
    });
  });

  describe('hasOverrideErrors', () => {
    const selector = selectors.hasOverrideErrors;
    it('returns true iff grades.gradeOverrideHistoryError is truthy', () => {
      expect(
        selector({ grades: { gradeOverrideHistoryError: ['some', 'results'] } }),
      ).toEqual(true);
      expect(selector({ grades: { gradeOverrideHistoryError: null } })).toEqual(false);
      expect(selector({ grades: {} })).toEqual(false);
    });
  });

  describe('uploadSuccess', () => {
    const selector = selectors.uploadSuccess;
    it('shows upload success when bulkManagement data returned/completed successfully', () => {
      expect(selector({ grades: { bulkManagement: { uploadSuccess: true } } })).toEqual(true);
    });
    it('returns false when bulk management data not returned', () => {
      expect(selector({ grades: {} })).toEqual(false);
    });
  });

  describe('simpleSelectors', () => {
    const testVal = 'some TEST value';
    const testSimpleSelector = (key) => {
      test(key, () => {
        expect(
          exportedSelectors[key]({ grades: { [key]: testVal } }),
        ).toEqual(testVal);
      });
    };
    testSimpleSelector('courseId');
    testSimpleSelector('filteredUsersCount');
    testSimpleSelector('totalUsersCount');
    testSimpleSelector('gradeFormat');
    testSimpleSelector('nextPage');
    testSimpleSelector('prevPage');
    testSimpleSelector('showSpinner');
    testSimpleSelector('gradeOverrideCurrentEarnedGradedOverride');
    testSimpleSelector('gradeOverrideHistoryError');
    testSimpleSelector('gradeOriginalEarnedGraded');
    testSimpleSelector('gradeOriginalPossibleGraded');
    testSimpleSelector('nextPage');
    testSimpleSelector('prevPage');
    testSimpleSelector('showSuccess');
  });
});
