import { getBulkManagementHistory } from './grades';

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

describe('getBulkManagementHistory', () => {
  it('handles history being as-yet unloaded', () => {
    const result = getBulkManagementHistory({ grades: { bulkManagement: {} } });
    expect(result).toEqual([]);
  });

  it('formats dates for us', () => {
    const result = getBulkManagementHistory({
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
    const result = getBulkManagementHistory({
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

  it('calculates skippage', () => {
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
