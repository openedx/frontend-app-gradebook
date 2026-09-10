import { renderHook, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { createQueryClientWrapper } from '@src/testUtils';
import lms from '@src/data/services/lms';
import { filtersSnapshot } from '@src/data/filtersSnapshot';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useCourseIdWithGate } from '@src/data/apiHook';
import {
  trackGradeOverrideSucceeded,
  trackGradeOverrideFailed,
  trackUploadOverrideSucceeded,
  trackUploadOverrideFailed,
} from '@src/data/services/segment/events';
import {
  getGrades, getGradesPage, getGradeOverrideHistory,
} from './api';
import {
  useGrades, useGradesData, useGradeOverrideHistory, useUpdateGrades, useSubmitImportGradesButtonData,
} from './apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('@src/data/services/lms', () => ({
  api: {
    updateGradebookData: jest.fn(),
    uploadGradeCsv: jest.fn(),
  },
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCourseIdWithGate: jest.fn(),
}));
jest.mock('@src/data/services/segment/events', () => ({
  trackGradeOverrideSucceeded: jest.fn(),
  trackGradeOverrideFailed: jest.fn(),
  trackUploadOverrideSucceeded: jest.fn(),
  trackUploadOverrideFailed: jest.fn(),
}));
jest.mock('./api', () => ({
  getGrades: jest.fn(),
  getGradesPage: jest.fn(),
  getGradeOverrideHistory: jest.fn(),
}));

const useParamsMock = jest.mocked(useParams);
const useGradebookUiMock = jest.mocked(useGradebookUi);
const useCourseIdWithGateMock = jest.mocked(useCourseIdWithGate);
const getGradesMock = jest.mocked(getGrades);
const getGradesPageMock = jest.mocked(getGradesPage);
const getGradeOverrideHistoryMock = jest.mocked(getGradeOverrideHistory);
const updateGradebookDataMock = jest.mocked(lms.api.updateGradebookData);
const uploadGradeCsvMock = jest.mocked(lms.api.uploadGradeCsv);

const renderQueryHook = <T,>(hook: () => T) => renderHook(hook, {
  wrapper: createQueryClientWrapper(),
});

const baseUiContext = () => ({
  gradesPageEndpoint: null,
  modalState: {
    reasonForChange: 'r',
    adjustedGradeValue: '10',
    updateModuleId: 'mod-1',
    updateUserId: 3,
  },
  setShowSuccess: jest.fn(),
  setGradesPageEndpoint: jest.fn(),
  setShowImportSuccessToast: jest.fn(),
  resetCsvUpload: jest.fn(),
  markCsvUploadSuccess: jest.fn(),
  setCsvUploadErrors: jest.fn(),
});

describe('GradesView/data apiHook', () => {
  let uiContext: ReturnType<typeof baseUiContext>;

  beforeEach(() => {
    jest.clearAllMocks();
    useParamsMock.mockReturnValue({ courseId: 'course-v1:X' });
    uiContext = baseUiContext();
    useGradebookUiMock.mockReturnValue(uiContext);
    useCourseIdWithGateMock.mockReturnValue({ courseId: 'course-v1:X', enabled: true });
    Object.assign(filtersSnapshot, {
      assignmentType: '',
      assignment: '',
      includeCourseRoleMembers: false,
      cohort: '',
      track: '',
      assignmentGradeMin: '0',
      assignmentGradeMax: '100',
      courseGradeMin: '0',
      courseGradeMax: '100',
      searchValue: '',
    });
  });

  describe('useGrades', () => {
    it('stays disabled without a courseId', () => {
      const { result } = renderQueryHook(() => useGrades('', null));
      expect(result.current.fetchStatus).toBe('idle');
      expect(getGradesMock).not.toHaveBeenCalled();
    });

    it('fetches the first page (built from filtersSnapshot) when no cursor is passed', async () => {
      getGradesMock.mockResolvedValue({ results: [] });
      const { result } = renderQueryHook(() => useGrades('course-v1:X', null));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(getGradesMock).toHaveBeenCalledTimes(1);
      expect(getGradesPageMock).not.toHaveBeenCalled();
    });

    it('fetches the cursor URL when gradesPageEndpoint is provided', async () => {
      getGradesPageMock.mockResolvedValue({ results: [] });
      const { result } = renderQueryHook(
        () => useGrades('course-v1:X', 'https://lms/next'),
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(getGradesPageMock).toHaveBeenCalledWith('https://lms/next');
    });
  });

  describe('useGradesData', () => {
    it('sorts results by username and mirrors the pagination + counts', async () => {
      getGradesMock.mockResolvedValue({
        results: [
          { username: 'zeta', section_breakdown: [] },
          { username: 'alpha', section_breakdown: [] },
        ],
        previous: 'prev-url',
        next: 'next-url',
        total_users_count: 12,
        filtered_users_count: 5,
      });
      const { result } = renderQueryHook(useGradesData);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.results.map(r => r.username)).toEqual(['alpha', 'zeta']);
      expect(result.current).toMatchObject({
        prevPage: 'prev-url',
        nextPage: 'next-url',
        totalUsersCount: 12,
        filteredUsersCount: 5,
      });
    });

    it('exposes empty defaults when the query has no data yet', () => {
      useCourseIdWithGateMock.mockReturnValue({ courseId: 'course-v1:X', enabled: false });
      const { result } = renderQueryHook(useGradesData);
      expect(result.current).toMatchObject({
        results: [],
        prevPage: null,
        nextPage: null,
        totalUsersCount: 0,
        filteredUsersCount: 0,
      });
    });
  });

  describe('useGradeOverrideHistory', () => {
    it('stays disabled until both subsectionId and userId are provided', () => {
      const { result } = renderQueryHook(() => useGradeOverrideHistory(undefined, undefined));
      expect(result.current.fetchStatus).toBe('idle');
      expect(getGradeOverrideHistoryMock).not.toHaveBeenCalled();
    });

    it('fetches once both identifiers are provided', async () => {
      getGradeOverrideHistoryMock.mockResolvedValue({ overrideHistory: [] });
      const { result } = renderQueryHook(() => useGradeOverrideHistory('sub-1', 3));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(getGradeOverrideHistoryMock).toHaveBeenCalledWith('sub-1', 3);
    });
  });

  describe('useUpdateGrades', () => {
    it('emits the success event, shows the banner, and resets the grades page on success', async () => {
      updateGradebookDataMock.mockResolvedValue({ data: { ok: true } });
      const { result } = renderQueryHook(useUpdateGrades);
      result.current();
      await waitFor(() => expect(trackGradeOverrideSucceeded).toHaveBeenCalledWith({ ok: true }));
      expect(updateGradebookDataMock).toHaveBeenCalledWith([{
        grade: { comment: 'r', earned_graded_override: '10' },
        usage_id: 'mod-1',
        user_id: 3,
      }]);
      expect(uiContext.setShowSuccess).toHaveBeenCalledWith(true);
      expect(uiContext.setGradesPageEndpoint).toHaveBeenCalledWith(null);
    });

    it('emits the failure event when the mutation errors out', async () => {
      const err = new Error('nope');
      updateGradebookDataMock.mockRejectedValue(err);
      const { result } = renderQueryHook(useUpdateGrades);
      result.current();
      await waitFor(() => expect(trackGradeOverrideFailed).toHaveBeenCalledWith(err));
    });
  });

  describe('useSubmitImportGradesButtonData', () => {
    const formData = new FormData();

    it('marks success and toasts on a successful CSV upload', async () => {
      uploadGradeCsvMock.mockResolvedValue({ data: {} });
      const { result } = renderQueryHook(useSubmitImportGradesButtonData);
      await result.current(formData);
      expect(uiContext.resetCsvUpload).toHaveBeenCalled();
      expect(uiContext.markCsvUploadSuccess).toHaveBeenCalled();
      expect(uiContext.setShowImportSuccessToast).toHaveBeenCalledWith(true);
      expect(trackUploadOverrideSucceeded).toHaveBeenCalled();
    });

    it('surfaces server-side error messages when the upload fails with error_messages', async () => {
      const err = { status: 200, data: { error_messages: ['bad row 1', 'bad row 2'] } };
      uploadGradeCsvMock.mockRejectedValue(err);
      const { result } = renderQueryHook(useSubmitImportGradesButtonData);
      await result.current(formData);
      expect(trackUploadOverrideFailed).toHaveBeenCalledWith(err);
      expect(uiContext.setCsvUploadErrors).toHaveBeenCalledWith(['bad row 1', 'bad row 2']);
    });

    it('sets a generic error when the failure has no error_messages payload', async () => {
      uploadGradeCsvMock.mockRejectedValue({ status: 500 });
      const { result } = renderQueryHook(useSubmitImportGradesButtonData);
      await result.current(formData);
      expect(uiContext.setCsvUploadErrors).toHaveBeenCalledWith(['Unknown error.']);
    });
  });
});
