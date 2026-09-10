import { renderHook, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { createQueryClientWrapper } from '@src/testUtils';
import { getAssignmentTypes, getCanUserViewGradebook } from './api';
import {
  useAssignmentTypes,
  useCanUserViewGradebook,
  useCanViewGradebook,
  useCourseIdWithGate,
  useShowBulkManagement,
} from './apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('./api', () => ({
  getCanUserViewGradebook: jest.fn(),
  getAssignmentTypes: jest.fn(),
}));

const useParamsMock = jest.mocked(useParams);
const canViewMock = jest.mocked(getCanUserViewGradebook);
const assignmentTypesMock = jest.mocked(getAssignmentTypes);

const setCourse = (courseId: string | undefined) => {
  useParamsMock.mockReturnValue({ courseId });
};

const renderQueryHook = <T,>(hook: () => T) => renderHook(hook, {
  wrapper: createQueryClientWrapper(),
});

describe('root apiHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setCourse('course-v1:X');
    canViewMock.mockResolvedValue(true);
    assignmentTypesMock.mockResolvedValue({
      assignmentTypes: ['Homework'],
      areGradesFrozen: false,
      bulkManagementAvailable: true,
    });
  });

  describe('useCanUserViewGradebook', () => {
    it('stays disabled when courseId is missing', () => {
      setCourse('');
      const { result } = renderQueryHook(() => useCanUserViewGradebook());
      expect(result.current.fetchStatus).toBe('idle');
      expect(canViewMock).not.toHaveBeenCalled();
    });

    it('resolves with the roles result for the current courseId', async () => {
      const { result } = renderQueryHook(() => useCanUserViewGradebook());
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toBe(true);
      expect(canViewMock).toHaveBeenCalledWith('course-v1:X');
    });
  });

  describe('useCanViewGradebook', () => {
    it('is optimistic (`true`) while the roles query is loading', () => {
      canViewMock.mockImplementation(() => new Promise(() => {}));
      const { result } = renderQueryHook(useCanViewGradebook);
      expect(result.current).toBe(true);
    });

    it('reflects the resolved value once loaded', async () => {
      canViewMock.mockResolvedValue(false);
      const { result } = renderQueryHook(useCanViewGradebook);
      await waitFor(() => expect(result.current).toBe(false));
    });

    it('returns false when the roles query errors out', async () => {
      canViewMock.mockRejectedValue(new Error('boom'));
      const { result } = renderQueryHook(useCanViewGradebook);
      await waitFor(() => expect(result.current).toBe(false));
    });
  });

  describe('useCourseIdWithGate', () => {
    it('starts gated and opens once the roles query resolves truthy', async () => {
      const { result } = renderQueryHook(useCourseIdWithGate);
      expect(result.current).toEqual({ courseId: 'course-v1:X', enabled: false });
      await waitFor(() => expect(result.current.enabled).toBe(true));
    });
  });

  describe('useAssignmentTypes', () => {
    it('stays disabled without a courseId', () => {
      const { result } = renderQueryHook(() => useAssignmentTypes(''));
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('stays disabled when the caller passes enabled=false', () => {
      const { result } = renderQueryHook(
        () => useAssignmentTypes('course-v1:X', { enabled: false }),
      );
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('fetches and returns the derived assignment-types data', async () => {
      const { result } = renderQueryHook(() => useAssignmentTypes('course-v1:X'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.assignmentTypes).toEqual(['Homework']);
    });
  });

  describe('useShowBulkManagement', () => {
    it('is false while gated (roles query not yet resolved)', () => {
      canViewMock.mockImplementation(() => new Promise(() => {}));
      const { result } = renderQueryHook(useShowBulkManagement);
      expect(result.current).toBe(false);
    });

    it('reflects the bulk-management flag from the assignment-types payload', async () => {
      const { result } = renderQueryHook(useShowBulkManagement);
      await waitFor(() => expect(result.current).toBe(true));
    });
  });
});
