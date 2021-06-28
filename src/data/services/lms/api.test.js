import api from './api';
import { pageSize, paramKeys } from './constants';
import messages from './messages';
import urls, { gradeCsvUrl, sectionOverrideHistoryUrl } from './urls';
import * as utils from './utils';

jest.mock('./urls', () => ({
  __esModule: true,
  default: jest.requireActual('./urls').default,
  gradeCsvUrl: (...args) => ({ gradeCsvUrl: args }),
  sectionOverrideHistoryUrl: (...args) => `sectionOverrideHistoryUrl(${args})`,
}));

jest.mock('./utils', () => ({
  get: jest.fn(),
  post: jest.fn(),
  stringifyUrl: jest.fn(),
}));

describe('lms service api', () => {
  describe('get actions', () => {
    const mockGet = promiseFn => {
      jest.spyOn(utils, 'get').mockImplementation(
        url => new Promise(promiseFn(url)),
      );
    };
    const resolveFn = (url) => (resolve) => resolve({ data: url });
    const rejectFn = (url) => (resolve, reject) => reject(url);
    const testSimpleFetch = (method, expectedUrl, description) => {
      mockGet(resolveFn);
      test(description, () => (
        method().then(({ data }) => { expect(data).toEqual(expectedUrl); })
      ));
    };
    describe('fetch.assignmentTypes', () => {
      testSimpleFetch(
        api.fetch.assignmentTypes,
        urls.assignmentTypes,
        'fetches from urls.assignmentTypes',
      );
    });
    describe('fetch.cohorts', () => {
      testSimpleFetch(
        api.fetch.cohorts,
        urls.cohorts,
        'fetches from urls.cohorts',
      );
    });
    describe('fetch.roles', () => {
      testSimpleFetch(
        api.fetch.roles,
        urls.roles,
        'fetches from urls.roles',
      );
    });
    describe('fetch.tracks', () => {
      testSimpleFetch(
        api.fetch.tracks,
        urls.tracks,
        'fetches from urls.tracks',
      );
    });
    describe('fetch.gradebookData', () => {
      const searchText = 'some user';
      const cohort = 2;
      const track = 'masters';
      const options = {
        courseGradeMax: 90,
        courseGradeMin: 10,
        includeCourseRoleMembers: true,
        assignment: 'some work',
        assignmentGradeMax: 95,
        assignmentGradeMin: 5,
      };

      it('throws an error if either assignmentGrade limit is set, but no assignment', () => {
        mockGet(resolveFn);
        expect(() => {
          api.fetch.gradebookData(
            searchText,
            cohort,
            track,
            { ...options, assignmentGradeMax: null, assignment: null },
          );
        }).toThrow(Error(messages.errors.missingAssignment));
        expect(() => {
          api.fetch.gradebookData(
            searchText,
            cohort,
            track,
            { ...options, assignmentGradeMin: null, assignment: null },
          );
        }).toThrow(Error(messages.errors.missingAssignment));
      });
      describe('fetches from urls.gradebook with queryParams loaded from options', () => {
        beforeEach(() => {
          mockGet(resolveFn);
        });
        test('loads only passed values if options is empty', () => (
          api.fetch.gradebookData(searchText, cohort, track).then(({ data }) => {
            expect(data).toEqual(utils.stringifyUrl(urls.gradebook, {
              [paramKeys.pageSize]: pageSize,
              [paramKeys.userContains]: searchText,
              [paramKeys.cohortId]: cohort,
              [paramKeys.enrollmentMode]: track,
              [paramKeys.courseGradeMax]: undefined,
              [paramKeys.courseGradeMin]: undefined,
              [paramKeys.excludedCourseRoles]: undefined,
              [paramKeys.assignment]: undefined,
              [paramKeys.assignmentGradeMax]: undefined,
              [paramKeys.assignmentGradeMin]: undefined,
            }));
          })
        ));
        test('loads ["all"] for excludedCorseRoles if not includeCourseRoles', () => (
          api.fetch.gradebookData(searchText, cohort, track, options).then(({ data }) => {
            expect(data).toEqual(utils.stringifyUrl(urls.gradebook, {
              [paramKeys.pageSize]: pageSize,
              [paramKeys.userContains]: searchText,
              [paramKeys.cohortId]: cohort,
              [paramKeys.enrollmentMode]: track,
              [paramKeys.courseGradeMax]: options.courseGradeMax,
              [paramKeys.courseGradeMin]: options.courseGradeMin,
              [paramKeys.excludedCourseRoles]: ['all'],
              [paramKeys.assignment]: options.assignment,
              [paramKeys.assignmentGradeMax]: options.assignmentGradeMax,
              [paramKeys.assignmentGradeMin]: options.assignmentGradeMin,
            }));
          })
        ));
        test('loads null for excludedCorseRoles if includeCourseRoles', () => (
          api.fetch.gradebookData(searchText, cohort, track, options).then(({ data }) => {
            expect(data).toEqual(utils.stringifyUrl(urls.gradebook, {
              [paramKeys.pageSize]: pageSize,
              [paramKeys.userContains]: searchText,
              [paramKeys.cohortId]: cohort,
              [paramKeys.enrollmentMode]: track,
              [paramKeys.courseGradeMax]: options.courseGradeMax,
              [paramKeys.courseGradeMin]: options.courseGradeMin,
              [paramKeys.excludedCourseRoles]: null,
              [paramKeys.assignment]: options.assignment,
              [paramKeys.assignmentGradeMax]: options.assignmentGradeMax,
              [paramKeys.assignmentGradeMin]: options.assignmentGradeMin,
            }));
          })
        ));
      });
    });
    describe('gradeBulkOperationHistory', () => {
      describe('success', () => {
        beforeEach(() => {
          mockGet(resolveFn);
        });
        it('fetches from urls.bulkHistory and returns the data', () => (
          api.fetch.gradeBulkOperationHistory().then(url => {
            expect(url).toEqual(urls.bulkHistory);
          })
        ));
      });
      describe('failure', () => {
        beforeEach(() => {
          mockGet(rejectFn);
        });
        it('rejects with unhandledResponse Error', () => (
          api.fetch.gradeBulkOperationHistory().catch(error => {
            expect(error).toEqual(Error(messages.errors.unhandledResponse));
          })
        ));
      });
    });
    describe('gradeOverrideHistory', () => {
      const subsectionId = 'a subsection';
      const userId = 'Thomas';
      beforeEach(() => {
        mockGet(resolveFn);
      });
      test('gets from urls.sectionOverrideHistoryUrl with passed subseciton and user ids', () => (
        api.fetch.gradeOverrideHistory(subsectionId, userId).then(({ data }) => {
          expect(data).toEqual(sectionOverrideHistoryUrl(subsectionId, userId));
        })
      ));
    });
  });
  describe('post actions', () => {
    const mockPost = promiseFn => {
      jest.spyOn(utils, 'post').mockImplementation(
        (url, callback) => new Promise(promiseFn(url, callback)),
      );
    };
    const resolveFn = (url, data) => (resolve) => resolve({ data: { url, data } });
    describe('updateGradebookData', () => {
      const updateData = { some: 'update data' };
      beforeEach(() => {
        mockPost(resolveFn);
      });
      test('posts to urls.bulkUpdate with passed data', () => (
        api.updateGradebookData(updateData).then(({ data }) => {
          expect(data).toEqual({ url: urls.bulkUpdate, data: updateData });
        })
      ));
    });
    describe('uploadGradeCsv', () => {
      describe('200 status with no error_messages', () => {
        const response = {
          status: 200,
          data: {
            error_messages: [],
            other: 'data',
          },
        };
        const formData = { some: 'form Data' };
        beforeEach(() => {
          mockPost(() => (resolve) => { resolve(response); });
        });
        it('posts formData to gradeCsvUrl and returns the data from response', () => (
          api.uploadGradeCsv(formData).then(result => {
            expect(result).toEqual(response.data);
          })
        ));
      });
      describe('non-200 status', () => {
        const formData = { some: 'form Data' };
        beforeEach(() => {
          mockPost((url, data) => (resolve) => { resolve({ url, data }); });
        });
        it('posts formData to gradeCsvUrl and returns the data from response', () => (
          api.uploadGradeCsv(formData).catch(result => {
            expect(result).toEqual({ url: gradeCsvUrl(), data: formData });
          })
        ));
      });
    });
  });
});
