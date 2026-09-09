import { getAuthenticatedHttpClient } from '@openedx/frontend-base';

import lms from '@src/data/services/lms';
import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from '@src/data/constants/errors';
import { getGrades, getGradesPage, getGradeOverrideHistory } from './api';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@src/data/services/lms', () => ({
  api: {
    fetch: {
      gradebookData: jest.fn(),
      gradeOverrideHistory: jest.fn(),
    },
  },
}));
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatGradeOverrideForDisplay: (rows: unknown[]) => rows.map((_, i) => ({ i })),
}));

const gradebookDataMock = lms.api.fetch.gradebookData as jest.Mock;
const gradeOverrideHistoryMock = lms.api.fetch.gradeOverrideHistory as jest.Mock;
const httpMock = getAuthenticatedHttpClient as jest.Mock;

describe('GradesView/data api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGrades', () => {
    it('delegates to lms.api.fetch.gradebookData and returns the response body', async () => {
      gradebookDataMock.mockResolvedValue({ data: { results: [{ id: 1 }] } });
      const params = {
        searchText: 'abc',
        cohort: 'c1',
        track: 't1',
        options: { assignment: 'a1' },
      };
      const data = await getGrades(params);
      expect(gradebookDataMock).toHaveBeenCalledWith('abc', 'c1', 't1', { assignment: 'a1' });
      expect(data).toEqual({ results: [{ id: 1 }] });
    });
  });

  describe('getGradesPage', () => {
    it('fetches the cursor URL through the authenticated http client', async () => {
      const get = jest.fn().mockResolvedValue({ data: { results: [] } });
      httpMock.mockReturnValue({ get });
      const data = await getGradesPage('https://lms/next?page=2');
      expect(get).toHaveBeenCalledWith('https://lms/next?page=2');
      expect(data).toEqual({ results: [] });
    });
  });

  describe('getGradeOverrideHistory', () => {
    it('throws the default message when the request fails', async () => {
      gradeOverrideHistoryMock.mockRejectedValue(new Error('network'));
      await expect(getGradeOverrideHistory('sub1', 3))
        .rejects.toThrow(GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG);
    });

    it('throws the server error message when the API reports success=false', async () => {
      gradeOverrideHistoryMock.mockResolvedValue({
        data: { success: false, error_message: 'not allowed' },
      });
      await expect(getGradeOverrideHistory('sub1', 3))
        .rejects.toThrow('not allowed');
    });

    it('falls back to the default message when success=false has no error_message', async () => {
      gradeOverrideHistoryMock.mockResolvedValue({
        data: { success: false, error_message: '' },
      });
      await expect(getGradeOverrideHistory('sub1', 3))
        .rejects.toThrow(GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG);
    });

    it('shapes the payload for the edit modal on success', async () => {
      gradeOverrideHistoryMock.mockResolvedValue({
        data: {
          success: true,
          history: [{}, {}],
          override: {
            earned_all_override: 1,
            possible_all_override: 2,
            earned_graded_override: 3,
            possible_graded_override: 4,
          },
          original_grade: {
            earned_all: 5,
            possible_all: 6,
            earned_graded: 7,
            possible_graded: 8,
          },
        },
      });
      const result = await getGradeOverrideHistory('sub1', 3);
      expect(result).toEqual({
        overrideHistory: [{ i: 0 }, { i: 1 }],
        currentEarnedAllOverride: 1,
        currentPossibleAllOverride: 2,
        currentEarnedGradedOverride: 3,
        currentPossibleGradedOverride: 4,
        originalGradeEarnedAll: 5,
        originalGradePossibleAll: 6,
        originalGradeEarnedGraded: 7,
        originalGradePossibleGraded: 8,
      });
    });

    it('nulls the override/original fields when the API omits them', async () => {
      gradeOverrideHistoryMock.mockResolvedValue({
        data: {
          success: true, history: [], override: null, original_grade: null,
        },
      });
      const result = await getGradeOverrideHistory('sub1', 3);
      expect(result).toMatchObject({
        currentEarnedAllOverride: null,
        currentPossibleAllOverride: null,
        currentEarnedGradedOverride: null,
        currentPossibleGradedOverride: null,
        originalGradeEarnedAll: null,
        originalGradePossibleAll: null,
        originalGradeEarnedGraded: null,
        originalGradePossibleGraded: null,
      });
    });
  });
});
