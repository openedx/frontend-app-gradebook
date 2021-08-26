import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as auth from '@edx/frontend-platform/auth';

import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from 'data/constants/errors';
import actions from 'data/actions';
import { sortAlphaAsc } from 'data/actions/utils';
import lms from 'data/services/lms';
import selectors from 'data/selectors';
import * as thunkActions from './grades';

import { createTestFetcher } from './testUtils';

const mockStore = configureMockStore([thunk]);

const courseId = 'course-v1:edX+DemoX+Demo_Course';
const cohort = 42;
const track = 'Masters of the universe';
const assignmentType = 'Potions Practice';
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

jest.mock('data/services/lms', () => ({
  __esModule: true,
  default: {
    api: {
      fetch: {
        gradebookData: jest.fn(),
        gradeBulkOperationHistory: jest.fn(),
        gradeOverrideHistory: jest.fn(),
        prevNextGrades: jest.fn(),
      },
      updateGradebookData: jest.fn(),
      uploadGradeCsv: jest.fn(),
    },
  },
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      formatGradeOverrideForDisplay: jest.fn((...args) => ({
        type: 'formatGradeOverrideForDisplay',
        args,
      })),
    },
    filters: {
      allFilters: jest.fn(),
      assignmentGradeMin: jest.fn(),
      assignmentGradeMax: jest.fn(),
    },
    app: {
      courseId: jest.fn(),
    },
    root: {},
  },
}));

selectors.filters.allFilters.mockReturnValue(allFilters);

describe('grades thunkActions', () => {
  beforeEach(() => {
    lms.api.fetch.gradebookData.mockClear();
    lms.api.fetch.gradeBulkOperationHistory.mockClear();
    lms.api.fetch.gradeOverrideHistory.mockClear();
    lms.api.fetch.prevNextGrades.mockClear();
    selectors.app.courseId = jest.fn(() => courseId);
    selectors.filters.cohort = jest.fn(() => cohort);
    selectors.filters.track = jest.fn(() => track);
    selectors.filters.assignmentType = jest.fn(() => assignmentType);
  });
  describe('fetchBulkUpgradeHistory', () => {
    const testFetch = createTestFetcher(
      lms.api.fetch.gradeBulkOperationHistory,
      thunkActions.fetchBulkUpgradeHistory,
      [],
      () => expect(lms.api.fetch.gradeBulkOperationHistory).toHaveBeenCalledWith(),
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
    const localFilters = { there: 'are', four: 'lights' };
    const responseData = {
      previous: 'PREvGrade',
      next: 'nextGRADe',
      results: gradesResults,
      total_users_count: 10,
      filtered_users_count: 8,
    };
    const expected = {
      assignmentType,
      cohort,
      courseId,
      track,
      grades: gradesResults.sort(sortAlphaAsc),
      prev: responseData.previous,
      next: responseData.next,
      totalUsersCount: responseData.total_users_count,
      filteredUsersCount: responseData.filtered_users_count,
    };

    const testFetch = ({ apiArgs, overrides }) => createTestFetcher(
      lms.api.fetch.gradebookData,
      thunkActions.fetchGrades,
      [overrides],
      () => {
        if (apiArgs !== undefined) {
          expect(
            lms.api.fetch.gradebookData,
          ).toHaveBeenCalledWith(...apiArgs);
        }
      },
    );

    const {
      started,
      received,
      finished,
      error,
    } = actions.grades.fetching;
    beforeEach(() => {
      selectors.root.localFilters = jest.fn(() => localFilters);
    });

    describe('fetchGradebookData args', () => {
      describe('searchText is not empty', () => {
        const options = { to: 'be', or: 'not', searchText: '' };
        test('searchText, cohort, track, and merged localFilters and options', () => (
          testFetch({
            overrides: { options },
            apiArgs: [null, cohort, track, { ...localFilters, ...options }],
          })(resolve => resolve({ data: responseData }))
        ));
      });
      describe('searchText is empty', () => {
        const options = { to: 'be', or: 'not', searchText: '' };
        test('null searchText', () => testFetch({
          overrides: { options },
          apiArgs: [null, cohort, track, { ...localFilters, ...options }],
        })(resolve => resolve({ data: responseData })));
      });
    });

    describe('after valid response', () => {
      it('dispatches success', () => testFetch({})(
        (resolve) => resolve({ data: responseData }),
        [
          started(),
          received({ ...expected }),
          finished(),
        ],
      ));
      describe('when passed assignmentType override', () => {
        const overrides = { assignmentType: 'Polymorph Practice' };
        it('dispatches success with passed assignmentType', () => testFetch(
          { overrides },
        )(
          (resolve) => resolve({ data: responseData }),
          [
            started(),
            received({ ...expected, assignmentType: overrides.assignmentType }),
            finished(),
          ],
        ));
      });
      describe('showSuccess', () => {
        const resolveFn = (resolve) => resolve({ data: responseData });
        it('dispatches success and opens banner if true', () => (
          testFetch({ overrides: { options: { showSuccess: true } } })(
            resolveFn,
            [
              started(),
              received({ ...expected }),
              actions.grades.banner.open(),
              finished(),
            ],
          )
        ));
      });
    });
    describe('empty response', () => {
      it('dispatches success on empty response', () => testFetch({})(
        (resolve) => resolve({ data: { ...responseData, results: [] } }),
        [
          started(),
          received({ ...expected, grades: [] }),
          finished(),
        ],
      ));
    });
    describe('after invalid response', () => {
      it('dispatches error', () => testFetch({})(
        (resolve, reject) => reject(),
        [started(), error()],
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
      lms.api.fetch.gradeOverrideHistory,
      thunkActions.fetchGradeOverrideHistory,
      [subsectionId, userId],
      () => {
        expect(
          lms.api.fetch.gradeOverrideHistory,
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

    describe('fetchGradesIfAssignmentGradeFiltersSet', () => {
      it('dispatches fetchGrades if assignmentGradeFiltersSet', () => {
        selectors.filters.areAssignmentGradeFiltersSet = jest.fn(() => true);
        const store = mockStore({});
        store.dispatch(thunkActions.fetchGradesIfAssignmentGradeFiltersSet());
        expect(store.getActions()).toEqual([
          { ...fetchGradesAction, args: [] },
        ]);
      });
      it('does not dispatch fetchGrades if assignmentGradeFilters not set', () => {
        selectors.filters.areAssignmentGradeFiltersSet = jest.fn(() => false);
        const store = mockStore({});
        store.dispatch(thunkActions.fetchGradesIfAssignmentGradeFiltersSet());
        expect(store.getActions()).toEqual([]);
      });
    });

    describe('updateGrades', () => {
      const updateData = { some: 'data' };
      const gradebookData = { data: { OTher: 'DATA' } };
      const testFetch = createTestFetcher(
        lms.api.updateGradebookData,
        thunkActions.updateGrades,
        [],
        () => expect(
          lms.api.updateGradebookData,
        ).toHaveBeenCalledWith(updateData),
      );
      beforeEach(() => {
        selectors.app.editUpdateData = jest.fn(() => updateData);
      });
      describe('valid response', () => {
        it('sends success event, and fetches matching user grades', () => testFetch(
          (resolve) => resolve(gradebookData),
          [
            actions.grades.update.request(),
            actions.grades.update.success({ data: gradebookData.data }),
            {
              ...fetchGradesAction,
              args: [{ assignmentType: 'All', options: { showSuccess: true } }],
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
              actions.grades.update.failure({ error }),
            ],
          );
        });
      });
    });
  });

  describe('fetchPrevNextGrades', () => {
    const endpoint = 'someEndpoint';
    const response = {
      results: gradesResults,
      previous: 'Prev',
      next: 'NEXT',
      total_users_count: 23,
      filtered_users_count: 12,
    };
    const {
      started,
      received,
      finished,
      error,
    } = actions.grades.fetching;
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
      return store.dispatch(thunkActions.fetchPrevNextGrades(endpoint)).then(() => {
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
          started(),
          received({
            grades: gradesResults.sort(sortAlphaAsc),
            prev: response.previous,
            next: response.next,
            totalUsersCount: response.total_users_count,
            filteredUsersCount: response.filtered_users_count,
            cohort,
            track,
            assignmentType,
            courseId,
          }),
          finished(),
        ],
      ));
    });
    describe('error response', () => {
      it('sends error action', () => testFetch(
        (resolve, reject) => reject(),
        [started(), error()],
      ));
    });
  });

  describe('submitImportGradesButtonData', () => {
    const formData = { form: 'data' };
    const testFetch = createTestFetcher(
      lms.api.uploadGradeCsv,
      thunkActions.submitImportGradesButtonData,
      [formData],
      () => expect(lms.api.uploadGradeCsv).toHaveBeenCalledWith(formData),
    );
    const { csvUpload, uploadOverride } = actions.grades;
    describe('valid data', () => {
      it('sends csvUpload finished and uploadOverride success actions', () => (
        testFetch(
          (resolve) => resolve(),
          [
            csvUpload.started(),
            csvUpload.finished(),
            uploadOverride.success(courseId),
          ],
        )
      ));
    });
    describe('error response', () => {
      describe('non-200 error', () => {
        it('sends uploadOverride failure w/ raw error and csvUploadError with default', () => {
          const error = { some: 'error' };
          return testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure({ courseId, error }),
            csvUpload.error({ errorMessages: ['Unknown error.'] }),
          ]);
        });
      });
      describe('200 error with no messages', () => {
        it('sends uploadOverride failure w/ raw error and csvUploadError with default', () => {
          const error = { status: 200, data: { error_messages: [] }, some: 'error' };
          return testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure({ courseId, error }),
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
          return testFetch((resolve, reject) => reject(error), [
            csvUpload.started(),
            uploadOverride.failure({ courseId, error }),
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
