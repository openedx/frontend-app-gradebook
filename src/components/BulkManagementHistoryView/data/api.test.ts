import lms from '@src/data/services/lms';

import { getBulkOperationHistory } from './api';

jest.mock('@src/data/services/lms', () => ({
  api: { fetch: { gradeBulkOperationHistory: jest.fn() } },
}));

const gradeBulkOperationHistoryMock = jest.mocked(lms.api.fetch.gradeBulkOperationHistory);

describe('BulkManagementHistoryView/data api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getBulkOperationHistory delegates to lms.api.fetch.gradeBulkOperationHistory with courseId', async () => {
    gradeBulkOperationHistoryMock.mockResolvedValue(['entry']);
    await expect(getBulkOperationHistory('course-v1:X')).resolves.toEqual(['entry']);
    expect(gradeBulkOperationHistoryMock).toHaveBeenCalledWith('course-v1:X');
  });
});
