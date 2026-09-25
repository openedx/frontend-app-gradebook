import { renderHook, waitFor } from '@testing-library/react';

import { createQueryClientWrapper } from '@src/testUtils';
import { getCohorts, getTracks } from './api';
import { useCohorts, useTracks } from './apiHook';

jest.mock('./api', () => ({
  getCohorts: jest.fn(),
  getTracks: jest.fn(),
}));

const cohortsMock = jest.mocked(getCohorts);
const tracksMock = jest.mocked(getTracks);

const renderQueryHook = <T,>(hook: () => T) => renderHook(hook, {
  wrapper: createQueryClientWrapper(),
});

describe('GradebookFilters/data apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cohortsMock.mockResolvedValue([{ id: 1, name: 'Cohort A' }]);
    tracksMock.mockResolvedValue([{ slug: 'verified' }]);
  });

  describe('useCohorts', () => {
    it('stays disabled without a courseId', () => {
      const { result } = renderQueryHook(() => useCohorts(''));
      expect(result.current.fetchStatus).toBe('idle');
      expect(cohortsMock).not.toHaveBeenCalled();
    });

    it('stays disabled when the caller passes enabled=false', () => {
      const { result } = renderQueryHook(() => useCohorts('course-v1:X', { enabled: false }));
      expect(result.current.fetchStatus).toBe('idle');
      expect(cohortsMock).not.toHaveBeenCalled();
    });

    it('fetches cohorts for the passed courseId and returns them', async () => {
      const { result } = renderQueryHook(() => useCohorts('course-v1:X'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(cohortsMock).toHaveBeenCalledWith('course-v1:X');
      expect(result.current.data).toEqual([{ id: 1, name: 'Cohort A' }]);
    });
  });

  describe('useTracks', () => {
    it('stays disabled without a courseId', () => {
      const { result } = renderQueryHook(() => useTracks(''));
      expect(result.current.fetchStatus).toBe('idle');
      expect(tracksMock).not.toHaveBeenCalled();
    });

    it('stays disabled when the caller passes enabled=false', () => {
      const { result } = renderQueryHook(() => useTracks('course-v1:X', { enabled: false }));
      expect(result.current.fetchStatus).toBe('idle');
      expect(tracksMock).not.toHaveBeenCalled();
    });

    it('fetches tracks for the passed courseId and returns them', async () => {
      const { result } = renderQueryHook(() => useTracks('course-v1:X'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(tracksMock).toHaveBeenCalledWith('course-v1:X');
      expect(result.current.data).toEqual([{ slug: 'verified' }]);
    });
  });
});
