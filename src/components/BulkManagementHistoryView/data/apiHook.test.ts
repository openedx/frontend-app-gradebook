import { renderHook, waitFor } from '@testing-library/react';

import { createQueryClientWrapper } from '@src/testUtils';
import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';

import { getBulkOperationHistory } from './api';
import { transformHistoryEntry } from './utils';
import { useBulkOperationHistory, useBulkManagementHistoryEntries } from './apiHook';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useAssignmentTypes: jest.fn(),
  useCourseIdWithGate: jest.fn(),
}));
jest.mock('./api', () => ({ getBulkOperationHistory: jest.fn() }));
jest.mock('./utils', () => ({ transformHistoryEntry: jest.fn((e) => ({ shaped: e.id })) }));

const useAssignmentTypesMock = useAssignmentTypes as jest.Mock;
const useCourseIdWithGateMock = useCourseIdWithGate as jest.Mock;
const getBulkOperationHistoryMock = getBulkOperationHistory as jest.Mock;
const transformHistoryEntryMock = transformHistoryEntry as jest.Mock;

const render = <T,>(hook: () => T) => renderHook(hook, {
  wrapper: createQueryClientWrapper(),
});

describe('BulkManagementHistoryView apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCourseIdWithGateMock.mockReturnValue({ courseId: 'course-v1:X', enabled: true });
    useAssignmentTypesMock.mockReturnValue({ data: { bulkManagementAvailable: true } });
    getBulkOperationHistoryMock.mockResolvedValue([{ id: 1 }, { id: 2 }]);
  });

  describe('useBulkOperationHistory', () => {
    it('stays disabled without a courseId', () => {
      const { result } = render(() => useBulkOperationHistory(''));
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('stays disabled when the caller passes enabled=false', () => {
      const { result } = render(() => useBulkOperationHistory('course-v1:X', { enabled: false }));
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('fetches the history for the current courseId', async () => {
      const { result } = render(() => useBulkOperationHistory('course-v1:X'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(getBulkOperationHistoryMock).toHaveBeenCalled();
    });
  });

  describe('useBulkManagementHistoryEntries', () => {
    it('returns an empty array while the query is loading', () => {
      const { result } = render(useBulkManagementHistoryEntries);
      expect(result.current).toEqual([]);
    });

    it('stays disabled when bulk management is not available', () => {
      useAssignmentTypesMock.mockReturnValue({ data: { bulkManagementAvailable: false } });
      const { result } = render(useBulkManagementHistoryEntries);
      expect(result.current).toEqual([]);
      expect(getBulkOperationHistoryMock).not.toHaveBeenCalled();
    });

    it('shapes the history rows through transformHistoryEntry', async () => {
      const { result } = render(useBulkManagementHistoryEntries);
      await waitFor(() => expect(result.current.length).toBe(2));
      expect(result.current).toEqual([{ shaped: 1 }, { shaped: 2 }]);
      expect(transformHistoryEntryMock).toHaveBeenCalledTimes(2);
    });
  });
});
