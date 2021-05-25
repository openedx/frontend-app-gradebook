/* eslint-disable import/no-named-as-default-member */
import selectors from '.';
import * as moduleSelectors from '.';

jest.mock('../services/LmsApiService', () => ({
  __esModule: true,
  default: {
    getGradeExportCsvUrl: jest.fn(
      (...args) => ({ getGradeExportCsvUrl: { args } }),
    ),
    getInterventionExportCsvUrl: jest.fn(
      (...args) => ({ getInterventionExportCsvUrl: { args } }),
    ),
  },
}));

const mockFn = (key) => jest.fn((state) => ({ [key]: state }));
const mockMetaFn = (key) => jest.fn((...args) => ({ [key]: { args } }));
const testState = { a: 'test', state: 'of', random: 'data' };

describe('root selectors', () => {
  const testCourseId = 'OxfordX+Time+Travel';

  const mockAssignmentType = 'Homework';
  const mockAssignmentLabel = 'HW 42';

  describe('lmsApiServiceArgs', () => {
    it('gathers formatted data from state for various lms api service calls', () => {
      selectors.cohorts.getCohortNameById = mockFn('getCohortNameById');
      selectors.filters.selectedAssignmentId = mockFn('selectedAssignmentId');
      selectors.filters.assignmentType = mockFn('assignmentType');
      selectors.filters.cohort = mockFn('cohort');
      selectors.filters.assignmentGradeMax = mockFn('assignmentGradeMax');
      selectors.filters.assignmentGradeMin = mockFn('assignmentGradeMin');
      selectors.filters.courseGradeMax = mockFn('courseGradeMax');
      selectors.filters.courseGradeMin = mockFn('courseGradeMin');
      selectors.grades.formatMaxAssignmentGrade = mockMetaFn('formatMaxAssignmentGrade');
      selectors.grades.formatMinAssignmentGrade = mockMetaFn('formatMinAssignmentGrade');
      selectors.grades.formatMinCourseGrade = mockFn('formatMinCourseGrade');
      selectors.grades.formatMaxCourseGrade = mockFn('formatMaxCourseGrade');
      const assignmentId = { selectedAssignmentId: testState };
      expect(moduleSelectors.lmsApiServiceArgs(testState)).toEqual({
        cohort: { getCohortNameById: testState },
        assignment: assignmentId,
        assignmentType: { assignmentType: testState },
        assignmentGradeMin: {
          formatMinAssignmentGrade: {
            args: [{ assignmentGradeMin: testState }, { assignmentId }],
          },
        },
        assignmentGradeMax: {
          formatMaxAssignmentGrade: {
            args: [{ assignmentGradeMax: testState }, { assignmentId }],
          },
        },
        courseGradeMin: {
          formatMinCourseGrade: { courseGradeMin: testState },
        },
        courseGradeMax: {
          formatMaxCourseGrade: { courseGradeMax: testState },
        },
      });
    });
  });

  describe('gradeExportUrl', () => {
    const selector = moduleSelectors.gradeExportUrl;
    let lmsApiServiceArgs;
    beforeEach(() => {
      selectors.filters.includeCourseRoleMembers = jest.fn();
      lmsApiServiceArgs = moduleSelectors.lmsApiServiceArgs;
      moduleSelectors.lmsApiServiceArgs = jest.fn(state => ({ lmsArgs: state }));
    });
    afterEach(() => {
      moduleSelectors.lmsApiServiceArgs = lmsApiServiceArgs;
    });
    describe('without includeCourseRoleMembers filter', () => {
      it('calls the API service with the right args, excluding all course roles', () => {
        selectors.filters.includeCourseRoleMembers.mockReturnValue(undefined);
        expect(selector(testState, { courseId: testCourseId })).toEqual({
          getGradeExportCsvUrl: {
            args: [testCourseId, { lmsArgs: testState, excludeCourseRoles: 'all' }],
          },
        });
      });
    });
    describe('with includeCourseRoleMembers filter', () => {
      it('calls the API service with the right args, including course roles', () => {
        selectors.filters.includeCourseRoleMembers.mockReturnValue(true);
        expect(selector(testState, { courseId: testCourseId })).toEqual({
          getGradeExportCsvUrl: {
            args: [testCourseId, { lmsArgs: testState, excludeCourseRoles: '' }],
          },
        });
      });
    });
  });

  describe('interventionExportUrl', () => {
    it('calls the API service with the right args', () => {
      const { lmsApiServiceArgs } = moduleSelectors;
      selectors.filters.includeCourseRoleMembers = jest.fn();
      moduleSelectors.lmsApiServiceArgs = jest.fn(state => ({ lmsArgs: state }));
      expect(
        moduleSelectors.interventionExportUrl(testState, { courseId: testCourseId }),
      ).toEqual({
        getInterventionExportCsvUrl: {
          args: [testCourseId, { lmsArgs: testState }],
        },
      });
      moduleSelectors.lmsApiServiceArgs = lmsApiServiceArgs;
    });
  });

  describe('getHeadings', () => {
    const selector = moduleSelectors.getHeadings;
    beforeEach(() => {
      selectors.grades.headingMapper = jest.fn(
        (type, label) => (breakdown) => ({ headingMapper: { type, label, breakdown } }),
      );
      selectors.filters.assignmentType = jest.fn();
      selectors.filters.selectedAssignmentLabel = jest.fn();
      selectors.grades.getExampleSectionBreakdown = mockFn('getExampleSectionBreakdown');
    });
    describe('no assignmentType or label selected', () => {
      it('maps selected filters into getExampleSectionBreakdown', () => {
        selectors.filters.assignmentType.mockReturnValue(undefined);
        selectors.filters.selectedAssignmentLabel.mockReturnValue(undefined);
        expect(selector(testState)).toEqual({
          headingMapper: {
            type: 'All',
            label: 'All',
            breakdown: { getExampleSectionBreakdown: testState },
          },
        });
      });
    });
    describe('assignmentType and label selected', () => {
      it('maps selected filters into getExampleSectionBreakdown', () => {
        selectors.filters.assignmentType.mockReturnValue(mockAssignmentType);
        selectors.filters.selectedAssignmentLabel.mockReturnValue(mockAssignmentLabel);
        expect(selector(testState)).toEqual({
          headingMapper: {
            type: mockAssignmentType,
            label: mockAssignmentLabel,
            breakdown: { getExampleSectionBreakdown: testState },
          },
        });
      });
    });
  });

  describe('showBulkManagement', () => {
    const mockAccess = (val) => {
      selectors.special.hasSpecialBulkManagementAccess = jest.fn(() => val);
    };
    const mockHasMastersTrack = (val) => {
      selectors.tracks.stateHasMastersTrack = jest.fn(() => val);
    };
    const selector = moduleSelectors.showBulkManagement;
    const mkState = (bulkManagementAvailable) => ({ config: { bulkManagementAvailable } });
    describe('user has special bulk management access', () => {
      it('returns true', () => {
        mockAccess(true);
        mockHasMastersTrack(false);
        expect(selector(mkState(true), { courseId: testCourseId })).toEqual(true);
      });
    });
    describe('user does not have special access', () => {
      beforeEach(() => {
        mockAccess(false);
      });
      describe('course has a masters track, but bulkManagement not available', () => {
        it('returns false', () => {
          mockHasMastersTrack(true);
          expect(selector(mkState(false), { courseId: testCourseId })).toEqual(false);
        });
      });
      describe('course does not have a masters track, but bulkManagement available', () => {
        it('returns false', () => {
          mockHasMastersTrack(false);
          expect(selector(mkState(true), { courseId: testCourseId })).toEqual(false);
        });
      });
      describe('course has a masters track, and bulkManagement is available', () => {
        it('returns false', () => {
          mockHasMastersTrack(true);
          expect(selector(mkState(true), { courseId: testCourseId })).toEqual(true);
        });
      });
    });
  });

  describe('shouldShowSpinner', () => {
    const selector = moduleSelectors.shouldShowSpinner;
    const testSelector = (canView, showSpinner, expected) => {
      selectors.roles.canUserViewGradebook = jest.fn(() => canView);
      selectors.grades.showSpinner = jest.fn(() => showSpinner);
      expect(selector(testState)).toEqual(expected);
    };
    describe('user can view gradebook, but showSpinner is false', () => {
      it('returns false', () => {
        testSelector(true, false, false);
      });
    });
    describe('user cannot view gradebook, but showSpinner is true', () => {
      it('returns false', () => {
        testSelector(false, true, false);
      });
    });
    describe('user can view gradebook, and showSpinner is true', () => {
      it('returns true', () => {
        testSelector(true, true, true);
      });
    });
  });
});
