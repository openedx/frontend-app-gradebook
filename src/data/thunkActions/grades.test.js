import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as auth from '@edx/frontend-platform/auth';
import * as thunkActions from './grades';
import actions from '../actions';
import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from '../constants/errors';
import { sortAlphaAsc } from '../actions/utils';
import LmsApiService from '../services/LmsApiService';
import selectors from '../selectors';

import { createTestFetcher } from './testUtils';

const mockStore = configureMockStore([thunk]);

const courseId = 'course-v1:edX+DemoX+Demo_Course';
const sections = [
  {
    subsection_name: 'Demo Course Overview',
    score_earned: 0,
    score_possible: 0,
    percent: 0,
    displayed_value: '0.00',
    grade_description: '(0.00/0.00)',
  },
  {
    subsection_name: 'Example Week 1: Getting Started',
    score_earned: 1,
    score_possible: 1,
    percent: 1,
    displayed_value: '1.00',
    grade_description: '(0.00/0.00)',
  },
];

const gradesResults = [
  {
    course_id: courseId,
    section_breakdown: [...sections],
    email: 'user1@example.com',
    username: 'user1',
    user_id: 1,
    percent: 0.5,
    letter_grade: null,
  },
  {
    course_id: courseId,
    section_breakdown: [...sections],
    email: 'user22@example.com',
    username: 'user22',
    user_id: 22,
    percent: 0,
    letter_grade: null,
  },
];

const allFilters = {
  assignment: { id: 'assigNment_ID' },
  assignmentGradeMax: 89,
  assignmentGradeMin: 12,
  courseGradeMax: 92,
  courseGradeMin: 2,
  includeCourseRoleMembers: true,
};

const testVal = 'A Test VALue';

jest.mock('../services/LmsApiService', () => ({
  fetchGradebookData: jest.fn(),
  fetchGradeBulkOperationHistory: jest.fn(),
  fetchGradeOverrideHistory: jest.fn(),
  fetchPrevNextGrades: jest.fn(),
  updateGradebookData: jest.fn(),
  updateGrades: jest.fn(),
  uploadGradeCsv: jest.fn(),
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('../selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      formatGradeOverrideForDisplay: (override) => ({
        formatGradeOverrideForDisplay: { override },
      }),
      formatMaxAssignmentGrade: (grade, { assignmentId }) => ({
        formatMaxAssignmentGrade: { grade, assignmentId },
      }),
      formatMinAssignmentGrade: (grade, { assignmentId }) => ({
        formatMinAssignmentGrade: { grade, assignmentId },
      }),
      formatMinCourseGrade: (grade) => ({
        formatMinCourseGrade: { grade },
      }),
      formatMaxCourseGrade: (grade) => ({
        formatMaxCourseGrade: { grade },
      }),
    },
    filters: {
      allFilters: jest.fn(),
      assignmentGradeMin: jest.fn(),
      assignmentGradeMax: jest.fn(),
    },
  },
}));

selectors.filters.allFilters.mockReturnValue(allFilters);

describe('grades thunkActions', () => {
  let oldSelectors;
  const mockSelectors = () => {
    oldSelectors = { ...selectors };
    selectors.grades = {
      formatGradeOverrideForDisplay: (override) => ({
        formatGradeOverrideForDisplay: { override },
      }),
      formatMaxAssignmentGrade: (grade, { assignmentId }) => ({
        formatMaxAssignmentGrade: { grade, assignmentId },
      }),
      formatMinAssignmentGrade: (grade, { assignmentId }) => ({
        formatMinAssignmentGrade: { grade, assignmentId },
      }),
      formatMinCourseGrade: (grade) => ({
        formatMinCourseGrade: { grade },
      }),
      formatMaxCourseGrade: (grade) => ({
        formatMaxCourseGrade: { grade },
      }),
    };
    selectors.filters = {
      allFilters: () => allFilters,
      assignmentGradeMin: jest.fn(),
      assignmentGradeMax: jest.fn(),
    };
  };
  const restoreSelectors = () => {
    selectors.grades = { ...oldSelectors.grades };
    selectors.filters = { ...oldSelectors.filters };
  };
  beforeEach(() => {
    LmsApiService.fetchGradebookData.mockClear();
    LmsApiService.fetchGradeBulkOperationHistory.mockClear();
    LmsApiService.fetchGradeOverrideHistory.mockClear();
    LmsApiService.fetchPrevNextGrades.mockClear();
    LmsApiService.updateGrades.mockClear();
  });
  beforeAll(() => {
    mockSelectors();
  });
  afterAll(() => {
    restoreSelectors();
  });
  describe('fetchBulkUpgradeHistory', () => {
    const testFetch = createTestFetcher(
      LmsApiService.fetchGradeBulkOperationHistory,
      thunkActions.fetchBulkUpgradeHistory,
      [courseId],
      () => expect(LmsApiService.fetchGradeBulkOperationHistory).toHaveBeenCalledWith(courseId),
    );
    describe('valid response', () => {
      it('dispatches bulkHistory.received with response', () => {
        testFetch((resolve) => resolve(testVal), [actions.grades.bulkHistory.received(testVal)]);
      });
    });
    describe('api failure', () => {
      it('dispatches bulkHistory.error', () => {
        testFetch((resolve, reject) => reject(), [actions.grades.bulkHistory.error()]);
      });
    });
  });

  describe('fetchGrades', () => {
    const responseData = {
      previous: 'PREvGrade',
      next: 'nextGRADe',
      results: gradesResults,
      total_users_count: 10,
      filtered_users_count: 8,
    };
    const expected = {
      grades: gradesResults.sort(sortAlphaAsc),
      cohort: 1,
      track: 'verified',
      assignmentType: 'Exam',
      prev: responseData.previous,
      next: responseData.next,
      courseId,
      totalUsersCount: responseData.total_users_count,
      filteredUsersCount: responseData.filtered_users_count,
    };
    const apiArgs = (options) => {
      const {
        assignment,
        assignmentGradeMax, assignmentGradeMin,
        courseGradeMax, courseGradeMin,
        includeCourseRoleMembers,
      } = allFilters;
      return [
        courseId,
        options.searchText || null,
        expected.cohort,
        expected.track,
        {
          assignment: assignment.id,
          assignmentGradeMax: selectors.grades.formatMaxAssignmentGrade(
            assignmentGradeMax, { assignmentId: assignment.id },
          ),
          assignmentGradeMin: selectors.grades.formatMinAssignmentGrade(
            assignmentGradeMin, { assignmentId: assignment.id },
          ),
          courseGradeMax: selectors.grades.formatMaxCourseGrade(
            courseGradeMax,
          ),
          courseGradeMin: selectors.grades.formatMinCourseGrade(
            courseGradeMin,
          ),
          includeCourseRoleMembers,
        },
      ];
    };
    const testFetchWithOptions = (options = false) => createTestFetcher(
      LmsApiService.fetchGradebookData,
      thunkActions.fetchGrades,
      [
        courseId,
        expected.cohort,
        expected.track,
        expected.assignmentType,
        options,
      ],
      () => {
        expect(
          LmsApiService.fetchGradebookData,
        ).toHaveBeenCalledWith(...apiArgs(options));
      },
    );
    const testFetch = testFetchWithOptions();

    describe('after valid response', () => {
      const successActions = [
        actions.grades.fetching.started(),
        actions.grades.fetching.received({ ...expected }),
        actions.grades.fetching.finished(),
      ];
      it('dispatches success', () => testFetch(
        (resolve) => resolve({ data: responseData }),
        [...successActions],
      ));
      describe('options', () => {
        const resolveFn = (resolve) => resolve({ data: responseData });
        describe('showSuccess', () => {
          it('dispatches success and opens banner if true', () => (
            testFetchWithOptions({ showSuccess: true })(
              resolveFn,
              [...successActions, actions.grades.banner.open()],
            )
          ));
          it('does not open banner if not true', () => testFetchWithOptions({})(
            resolveFn, [...successActions],
          ));
        });
        describe('searchText', () => {
          it('passes searchText to api call if included', () => {
            const options = { searchText: 'Search Text' };
            return testFetchWithOptions(options)(
              resolveFn,
              [...successActions],
              () => {
                expect(
                  LmsApiService.fetchGradebookData.mock.calls[0][1],
                ).toEqual(options.searchText);
              },
            );
          });
          it('passes null to api call for searchText if not included', () => {
            const options = {};
            return testFetchWithOptions(options)(
              resolveFn,
              [...successActions],
              () => {
                expect(
                  LmsApiService.fetchGradebookData.mock.calls[0][1],
                ).toEqual(null);
              },
            );
          });
        });
      });
    });
    describe('empty response', () => {
      it('dispatches success on empty response', () => testFetch(
        (resolve) => resolve({ data: { ...responseData, results: [] } }),
        [
          actions.grades.fetching.started(),
          actions.grades.fetching.received({ ...expected, grades: [] }),
          actions.grades.fetching.finished(),
        ],
      ));
    });
    describe('after invalid response', () => {
      it('dispatches error', () => testFetch(
        (resolve, reject) => reject(),
        [
          actions.grades.fetching.started(),
          actions.grades.fetching.error(),
        ],
      ));
    });
  });

  describe('fetchGradeOverrideHistory', () => {
    const subsectionId = 'subsectionId-11111';
    const userId = 'user-id-11111';

    const originalGrade = {
      earned_all: 1.0,
      possible_all: 12.0,
      earned_graded: 3.0,
      possible_graded: 8.0,
    };

    const override = {
      earned_all_override: 13.0,
      possible_all_override: 13.0,
      earned_graded_override: 10.0,
      possible_graded_override: 10.0,
    };
    const history = { some: 'history' };

    const testFetch = createTestFetcher(
      LmsApiService.fetchGradeOverrideHistory,
      thunkActions.fetchGradeOverrideHistory,
      [subsectionId, userId],
      () => {
        expect(
          LmsApiService.fetchGradeOverrideHistory,
        ).toHaveBeenCalledWith(subsectionId, userId);
      },
    );

    describe('valid data', () => {
      describe('if data.success', () => {
        describe('override', () => {
          it('loads override values and sets original to null', () => {
            const resolveFn = (resolve) => {
              resolve({ data: { success: true, history, override } });
            };
            return testFetch(resolveFn, [
              actions.grades.overrideHistory.received({
                overrideHistory: selectors.grades.formatGradeOverrideForDisplay(history),
                currentEarnedAllOverride: override.earned_all_override,
                currentPossibleAllOverride: override.possible_all_override,
                currentEarnedGradedOverride: override.earned_graded_override,
                currentPossibleGradedOverride: override.possible_graded_override,
                originalGradeEarnedAll: null,
                originalGradePossibleAll: null,
                originalGradeEarnedGraded: null,
                originalGradePossibleGraded: null,
              }),
            ]);
          });
        });
        describe('original', () => {
          it('loads original values and sets overrides to null', () => {
            const resolveFn = (resolve) => {
              resolve({ data: { success: true, history, original_grade: originalGrade } });
            };
            return testFetch(resolveFn, [
              actions.grades.overrideHistory.received({
                overrideHistory: selectors.grades.formatGradeOverrideForDisplay(history),
                currentEarnedAllOverride: null,
                currentPossibleAllOverride: null,
                currentEarnedGradedOverride: null,
                currentPossibleGradedOverride: null,
                originalGradeEarnedAll: originalGrade.earned_all,
                originalGradePossibleAll: originalGrade.possible_all,
                originalGradeEarnedGraded: originalGrade.earned_graded,
                originalGradePossibleGraded: originalGrade.possible_graded,
              }),
            ]);
          });
        });
        describe('no override or original', () => {
          it('loads null for current and override fields', () => {
            const resolveFn = (resolve) => {
              resolve({ data: { success: true, history } });
            };
            return testFetch(resolveFn, [
              actions.grades.overrideHistory.received({
                overrideHistory: selectors.grades.formatGradeOverrideForDisplay(history),
                currentEarnedAllOverride: null,
                currentPossibleAllOverride: null,
                currentEarnedGradedOverride: null,
                currentPossibleGradedOverride: null,
                originalGradeEarnedAll: null,
                originalGradePossibleAll: null,
                originalGradeEarnedGraded: null,
                originalGradePossibleGraded: null,
              }),
            ]);
          });
        });
      });
      describe('if not data.success', () => {
        it('dispatchs error with error_message', () => {
          const errorMessage = 'oh Noooooooo!';
          const resolveFn = (resolve) => {
            resolve({ data: { success: false, error_message: errorMessage } });
          };
          return testFetch(resolveFn, [
            actions.grades.overrideHistory.error(errorMessage),
          ]);
        });
      });
    });
    describe('api failure', () => {
      it('sends error action with default error message', () => {
        const resolveFn = (resolve, reject) => reject();
        return testFetch(resolveFn, [
          actions.grades.overrideHistory.error(
            GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG,
          ),
        ]);
      });
    });
  });

  describe('fetchGrades inheritors', () => {
    let fetchGrades;
    const fetchGradesAction = { type: 'fetchGrades' };
    beforeEach(() => {
      fetchGrades = thunkActions.fetchGrades;
      thunkActions.fetchGrades = jest.fn().mockImplementation((...args) => ({
        ...fetchGradesAction,
        args,
      }));
    });
    afterEach(() => {
      thunkActions.fetchGrades = fetchGrades;
    });
    describe('fetchMatchingUserGrades', () => {
      it('calls with added searchText and showSuccess options', () => {
        const store = mockStore({});
        const args = {
          searchText: 'Some SearcH',
          cohort: 'coHOrt',
          track: 'TRAck',
          assignmentType: 'aType',
          showSuccess: true,
          options: { some: 'options' },
        };
        store.dispatch(thunkActions.fetchMatchingUserGrades(
          courseId,
          args.searchText,
          args.cohort,
          args.track,
          args.assignmentType,
          args.showSuccess,
          args.options,
        ));
        expect(store.getActions()).toEqual([
          {
            ...fetchGradesAction,
            args: [
              courseId,
              args.cohort,
              args.track,
              args.assignmentType,
              { searchText: args.searchText, showSuccess: args.showSuccess, ...args.options },
            ],
          },
        ]);
      });
    });
    describe('updateGrades', () => {
      const args = {
        updateData: { some: 'data' },
        searchText: 'SEARch TErm',
        cohort: 'COhoRT',
        track: 'trACk',
      };
      const gradebookData = { data: { OTher: 'DATA' } };

      const testFetch = createTestFetcher(
        LmsApiService.updateGradebookData,
        thunkActions.updateGrades,
        [courseId, args.updateData, args.searchText, args.cohort, args.track],
        () => expect(
          LmsApiService.updateGradebookData,
        ).toHaveBeenCalledWith(courseId, args.updateData),
      );
      let fetchMatchingUserGrades;
      const fetchMatchingUserGradesAction = { type: 'fetchMatchingUserGrades' };
      beforeEach(() => {
        fetchMatchingUserGrades = jest.spyOn(
          thunkActions,
          'fetchMatchingUserGrades',
        ).mockImplementation((...actionArgs) => ({
          ...fetchMatchingUserGradesAction,
          args: actionArgs,
        }));
      });
      afterEach(() => {
        fetchMatchingUserGrades.mockRestore();
      });
      describe('valid response', () => {
        it('sends success event, and fetches matching user grades', () => testFetch(
          (resolve) => resolve(gradebookData),
          [
            actions.grades.update.request(),
            actions.grades.update.success({ courseId, data: gradebookData.data }),
            {
              ...fetchMatchingUserGradesAction,
              args: [
                courseId,
                args.searchText,
                args.cohort,
                args.track,
                thunkActions.defaultAssignmentFilter,
                true,
                { searchText: args.searchText },
              ],
            },
          ],
        ));
      });
      describe('error response', () => {
        it('sends failure event', () => {
          const error = 'Some ERRor';
          return testFetch(
            (resolve, reject) => reject(error),
            [
              actions.grades.update.request(),
              actions.grades.update.failure({ courseId, error }),
            ],
          );
        });
      });
    });

    describe('updateGradesIfAssignmentGradeFiltersSet', () => {
      const args = {
        cohort: 'coHOrt',
        track: 'trAck',
        assignmentType: 'bananas',
      };
      let assignmentGradeMin;
      let assignmentGradeMax;
      const mockFilters = (minValue, maxValue) => {
        assignmentGradeMax = jest.spyOn(
          selectors.filters, 'assignmentGradeMax',
        ).mockReturnValue(maxValue);
        assignmentGradeMin = jest.spyOn(
          selectors.filters, 'assignmentGradeMin',
        ).mockReturnValue(minValue);
      };
      const callUpdate = (expectedActions) => {
        const store = mockStore({});
        store.dispatch(thunkActions.updateGradesIfAssignmentGradeFiltersSet(
          courseId,
          args.cohort,
          args.track,
          args.assignmentType,
        ));
        expect(store.getActions()).toEqual(expectedActions);
      };
      afterEach(() => {
        assignmentGradeMin.mockRestore();
        assignmentGradeMax.mockRestore();
      });
      describe('if neither assignment grade filter is set', () => {
        mockFilters(undefined, undefined);
        it('does not call', () => callUpdate([]));
      });
      describe('if either assignment grade filter is set', () => {
        const assertFetchGradesCalled = () => callUpdate([
          {
            ...fetchGradesAction,
            args: [
              courseId,
              args.cohort,
              args.track,
              args.assignmentType,
            ],
          },
        ]);
        it('calls if min is set', () => {
          mockFilters(21, undefined);
          return assertFetchGradesCalled();
        });
        it('calls if max is set', () => {
          mockFilters(undefined, 92);
          return assertFetchGradesCalled();
        });
      });
    });
  });

  describe('fetchPrevNextGrades', () => {
    const args = {
      endpoint: 'someEndpoint',
      cohort: 'COhoRT',
      track: 'TracK',
      assignmentType: '23',
    };
    const response = {
      results: gradesResults,
      previous: 'Prev',
      next: 'NEXT',
      total_users_count: 23,
      filtered_users_count: 12,
    };
    const { fetching } = actions.grades;
    let getClient;

    const mockClient = (resolveFn) => {
      getClient = jest.spyOn(
        auth,
        'getAuthenticatedHttpClient',
      ).mockReturnValue({
        get: jest.fn().mockReturnValue(new Promise(resolveFn)),
      });
    };

    const testFetch = (
      resolveFn,
      expectedActions,
    ) => {
      const store = mockStore({});
      mockClient(resolveFn);
      return store.dispatch(thunkActions.fetchPrevNextGrades(
        args.endpoint,
        courseId,
        args.cohort,
        args.track,
        args.assignmentType,
      )).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    };

    afterEach(() => {
      getClient.mockRestore();
    });

    describe('valid data', () => {
      it('sends finished action and loads results', () => testFetch(
        (resolve) => resolve({ data: response }),
        [
          fetching.started(),
          fetching.received({
            grades: gradesResults.sort(sortAlphaAsc),
            prev: response.previous,
            next: response.next,
            totalUsersCount: response.total_users_count,
            filteredUsersCount: response.filtered_users_count,
            cohort: args.cohort,
            track: args.track,
            assignmentType: args.assignmentType,
            courseId,
          }),
          fetching.finished(),
        ],
      ));
    });
    describe('error response', () => {
      it('sends error action', () => testFetch(
        (resolve, reject) => reject(),
        [fetching.started(), fetching.error()],
      ));
    });
  });

  describe('submitFileUploadFormData', () => {
    const formData = { form: 'data' };
    const testFetch = createTestFetcher(
      LmsApiService.uploadGradeCsv,
      thunkActions.submitFileUploadFormData,
      [courseId, formData],
      () => expect(LmsApiService.uploadGradeCsv).toHaveBeenCalledWith(courseId, formData),
    );
    const { csvUpload, uploadOverride } = actions.grades;
    describe('valid data', () => {
      it('sends csvUpload finished and uploadOverride success actions', () => {
        testFetch(
          (resolve) => resolve(),
          [
            csvUpload.started(),
            csvUpload.finished(),
            uploadOverride.success(courseId),
          ],
        );
      });
    });
    describe('error response', () => {
      describe('non-200 error', () => {
        it('sends uploadOverride failure w/ raw error and csvUploadError with default', () => {
          const error = { some: 'error' };
          testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure(courseId, error),
            csvUpload.error({ errorMessages: ['Unknown error.'] }),
          ]);
        });
      });
      describe('200 error with no messages', () => {
        it('sends uploadOverride failure w/ raw error and csvUploadError with default', () => {
          const error = { status: 200, data: { error_messages: [] }, some: 'error' };
          testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure(courseId, error),
            csvUpload.error({ errorMessages: ['Unknown error.'] }),
          ]);
        });
      });
      describe('200 error with messages', () => {
        it('sends uploadOverride failure w/ raw error and csvUploadError w loaded error', () => {
          const error = {
            status: 200,
            data: {
              error_messages: ['some', 'errors'], saved: 21, total: 32,
            },
          };
          testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure(courseId, error),
            csvUpload.error({
              errorMessages: error.data.error_messages,
              saved: error.data.saved,
              total: error.data.total,
            }),
          ]);
        });
      });
    });
  });
});
