import lms from '@src/data/services/lms';

import { getBulkOperationHistory } from './api';

jest.mock('@src/data/services/lms', () => ({
  api: { fetch: { gradeBulkOperationHistory: jest.fn() } },
}));

const gradeBulkOperationHistoryMock = lms.api.fetch.gradeBulkOperationHistory as jest.Mock;

describe('BulkManagementHistoryView/data api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getBulkOperationHistory delegates to lms.api.fetch.gradeBulkOperationHistory', async () => {
    gradeBulkOperationHistoryMock.mockResolvedValue(['entry']);
    await expect(getBulkOperationHistory()).resolves.toEqual(['entry']);
    expect(gradeBulkOperationHistoryMock).toHaveBeenCalled();
  });
});
