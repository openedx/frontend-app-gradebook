/* eslint-disable import/no-named-as-default-member, import/no-named-as-default */
import * as filterConstants from '../constants/filters';
import selectors from '.';
import * as moduleSelectors from '.';
import { minGrade, maxGrade } from './grades';

jest.mock('data/services/lms', () => ({
  urls: {
    gradeCsvUrl: jest.fn(
      (...args) => ({ gradeCsvUrl: { args } }),
    ),
    interventionExportCsvUrl: jest.fn(
      (...args) => ({ interventionExportCsvUrl: { args } }),
    ),
  },
}));

const mockFn = (key) => jest.fn((state) => ({ [key]: state }));
const mockMetaFn = (key) => jest.fn((...args) => ({ [key]: { args } }));
const testState = { a: 'test', state: 'of', random: 'data' };
const testVal = 'bananas';

describe('root selectors', () => {
  const testCourseId = 'OxfordX+Time+Travel';

  const mockAssignmentType = 'Homework';
  const mockAssignmentLabel = 'HW 42';
  beforeEach(() => {
    selectors.app.courseId = jest.fn(() => testCourseId);
  });
  describe('editModalPossibleGrade', () => {
    const selector = moduleSelectors.editModalPossibleGrade;
    const grade1 = '42';
    const grade2 = '3.14';
    it('returns app.modalState.adjustedGradePossible if set', () => {
      selectors.app.modalState.adjustedGradePossible = jest.fn(() => grade1);
      selectors.grades.gradeOriginalPossibleGraded = jest.fn(() => grade2);
      expect(selector(testState)).toEqual(grade1);
    });
    it('returns grades.gradeOriginalPossibleGraded if not overridden in modal', () => {
      selectors.app.modalState.adjustedGradePossible = jest.fn(() => null);
      selectors.grades.gradeOriginalPossibleGraded = jest.fn(() => grade2);
      expect(selector(testState)).toEqual(grade2);
    });
  });
  describe('filterBadgeConfig', () => {
    let config;
    const filterName = 'seasoning';
    const filters = ['withSalt', 'withGarlic'];

    const badgeValues = moduleSelectors.filterBadgeValues;
    const { isDefault } = selectors.filters;
    const oldConfig = filterConstants.filterConfig;

    beforeEach(() => {
      selectors.filters.isDefault = jest.fn();
    });
    afterEach(() => {
      moduleSelectors.filterBadgeValues = badgeValues;
      selectors.filters.isDefault = isDefault;
      filterConstants.filterConfig = oldConfig;
    });
    describe('range filter (filterOrder in config)', () => {
      const values = [3.14, 42];
      const valueFn = () => values;
      const testConfig = {
        fake: 'config',
        fields: 'for tests',
        filterOrder: filters,
      };
      beforeEach(() => {
        moduleSelectors.filterBadgeValues = { [filterName]: valueFn };
      });
      describe('if both are default values', () => {
        beforeEach(() => {
          filterConstants.filterConfig[filterName] = testConfig;
          selectors.filters.isDefault.mockReturnValue(true);
          config = selectors.root.filterBadgeConfig(testState, filterName);
        });
        it('returns isDefault: true, string value, and remaining filterConfig', () => {
          const { filterOrder, ...rest } = testConfig;
          expect(config).toEqual({
            isDefault: true,
            value: `${values[0]} - ${values[1]}`,
            ...rest,
          });
        });
      });
      describe('if neither/only 1 are default values', () => {
        describe.each([
          ['neither', () => false],
          ['only filter1', (v) => v === filters[0]],
          ['only filter2', (v) => v === filters[1]],
        ], '%1 is default', (label, isDefaultFn) => {
          beforeEach(() => {
            filterConstants.filterConfig[filterName] = testConfig;
            config = selectors.root.filterBadgeConfig(testState, filterName);
          });

          it('returns isDefault: false, string value, and remaining filterConfig', () => {
            selectors.filters.isDefault.mockImplementation(isDefaultFn);
            const { filterOrder, ...rest } = testConfig;
            expect(config).toEqual({
              isDefault: false,
              value: `${values[0]} - ${values[1]}`,
              ...rest,
            });
          });
        });
      });
    });
    describe('single-value filter', () => {
      const value = 3.14;
      const valueFn = () => value;
      const testConfig = {
        fake: 'config',
        fields: 'for tests',
      };
      beforeEach(() => {
        filterConstants.filterConfig[filterName] = testConfig;
        moduleSelectors.filterBadgeValues = { [filterName]: valueFn };
      });
      describe('if is default', () => {
        beforeEach(() => {
          selectors.filters.isDefault.mockReturnValue(true);
          config = selectors.root.filterBadgeConfig(testState, filterName);
        });
        it('returns isDefault: true, string value, and filterConfig values', () => {
          expect(config).toEqual({
            isDefault: true,
            value,
            ...testConfig,
          });
        });
      });
      describe('if is not default', () => {
        beforeEach(() => {
          selectors.filters.isDefault.mockReturnValue(false);
          config = selectors.root.filterBadgeConfig(testState, filterName);
        });
        it('returns isDefault: true, string value, and filterConfig values', () => {
          expect(config).toEqual({
            isDefault: false,
            value,
            ...testConfig,
          });
        });
      });
    });
  });
  describe('filterBadgeValues', () => {
    const mockSelector = (obj, name, key) => (
      jest.spyOn(obj, name).mockImplementation(state => state[key])
    );
    describe('assignment', () => {
      let mock;
      const selector = moduleSelectors.filterBadgeValues.assignment;
      beforeEach(() => {
        mock = mockSelector(selectors.filters, 'selectedAssignmentLabel', 'value');
      });
      afterEach(() => {
        mock.mockRestore();
      });
      it('returns selectedAssignmentLabel if there is one selected', () => {
        expect(selector({ value: testVal })).toEqual(testVal);
      });
      it('returns empty string if no assignment is selected', () => {
        expect(selector({ value: null })).toEqual('');
      });
    });
    describe('assignmentType', () => {
      it('returns assignmentType filter', () => {
        expect(
          moduleSelectors.filterBadgeValues.assignmentType,
        ).toEqual(selectors.filters.assignmentType);
      });
    });
    describe('includeCourseRoleMembers', () => {
      it('returns includeCourseRoleMembers filter', () => {
        expect(
          moduleSelectors.filterBadgeValues.includeCourseRoleMembers,
        ).toEqual(selectors.filters.includeCourseRoleMembers);
      });
    });
    describe('cohort', () => {
      let mock;
      const selector = moduleSelectors.filterBadgeValues.cohort;
      beforeEach(() => {
        mock = mockSelector(moduleSelectors, 'selectedCohortEntry', 'entry');
      });
      afterEach(() => {
        mock.mockRestore();
      });
      it('returns selectedCohortEntry name if one is selected', () => {
        expect(selector({ entry: { name: testVal } })).toEqual(testVal);
      });
      it('returns empty string if no cohort selected', () => {
        expect(selector({ entry: undefined })).toEqual('');
      });
    });
    describe('track', () => {
      let mock;
      const selector = moduleSelectors.filterBadgeValues.track;
      beforeEach(() => {
        mock = mockSelector(moduleSelectors, 'selectedTrackEntry', 'entry');
      });
      afterEach(() => {
        mock.mockRestore();
      });
      it('returns selectedTrackEntry name if one is selected', () => {
        expect(selector({ entry: { name: testVal } })).toEqual(testVal);
      });
      it('returns empty string if no track selected', () => {
        expect(selector({ entry: undefined })).toEqual('');
      });
    });
    describe('assignmentGrade', () => {
      const selector = moduleSelectors.filterBadgeValues.assignmentGrade;
      it('returns [filters.assignmentGradeMin, filters.assignmentGradeMax]', () => {
        jest.spyOn(selectors.filters, 'assignmentGradeMin').mockImplementation(
          state => ({ assignmentGradeMin: state }),
        );
        jest.spyOn(selectors.filters, 'assignmentGradeMax').mockImplementation(
          state => ({ assignmentGradeMax: state }),
        );
        expect(selector(testState)).toEqual([
          selectors.filters.assignmentGradeMin(testState),
          selectors.filters.assignmentGradeMax(testState),
        ]);
      });
    });
    describe('courseGrade', () => {
      const selector = moduleSelectors.filterBadgeValues.courseGrade;
      it('returns [filters.courseGradeMin, filters.courseGradeMax]', () => {
        jest.spyOn(selectors.filters, 'courseGradeMin').mockImplementation(
          state => ({ courseGradeMin: state }),
        );
        jest.spyOn(selectors.filters, 'courseGradeMax').mockImplementation(
          state => ({ courseGradeMax: state }),
        );
        expect(selector(testState)).toEqual([
          selectors.filters.courseGradeMin(testState),
          selectors.filters.courseGradeMax(testState),
        ]);
      });
    });
  });
  describe('formattedGradeLimits', () => {
    const selector = moduleSelectors.formattedGradeLimits;
    const mockAssgn = (assignmentGradeMax, assignmentGradeMin) => {
      selectors.app.assignmentGradeLimits = jest.fn(() => ({
        assignmentGradeMax,
        assignmentGradeMin,
      }));
    };
    const mockCourse = (courseGradeMax, courseGradeMin) => {
      selectors.app.courseGradeLimits = jest.fn(() => ({ courseGradeMax, courseGradeMin }));
    };
    const mockId = (id) => {
      selectors.filters.selectedAssignmentId = jest.fn(() => id);
    };
    const grade1 = '42';
    const grade2 = '3.14';
    it('returns an object of nullable assignmentGrades if assignment is not set', () => {
      mockId(undefined);
      mockAssgn(grade1, grade2);
      mockCourse(grade1, grade2);
      expect(selector(testState)).toEqual({
        assignmentGradeMax: null,
        assignmentGradeMin: null,
        courseGradeMax: '42',
        courseGradeMin: '3.14',
      });
    });
    it('returns null for each extreme iff they are equal their default', () => {
      mockId('an ID!');
      mockAssgn(maxGrade, grade1);
      mockCourse(grade2, minGrade);
      expect(selector(testState)).toEqual({
        assignmentGradeMax: null,
        assignmentGradeMin: grade1,
        courseGradeMax: grade2,
        courseGradeMin: null,
      });
      mockAssgn(grade2, minGrade);
      mockCourse(maxGrade, grade1);
      expect(selector(testState)).toEqual({
        assignmentGradeMax: grade2,
        assignmentGradeMin: null,
        courseGradeMax: null,
        courseGradeMin: grade1,
      });
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
    it('calls the API service with the right args', () => {
      expect(selector(testState)).toEqual({
        gradeCsvUrl: {
          args: [{ lmsArgs: testState }],
        },
      });
    });
  });
  describe('interventionExportUrl', () => {
    it('calls the API service with the right args', () => {
      const { lmsApiServiceArgs } = moduleSelectors;
      selectors.filters.includeCourseRoleMembers = jest.fn();
      moduleSelectors.lmsApiServiceArgs = jest.fn(state => ({ lmsArgs: state }));
      expect(
        moduleSelectors.interventionExportUrl(testState),
      ).toEqual({
        interventionExportCsvUrl: {
          args: [{ lmsArgs: testState }],
        },
      });
      moduleSelectors.lmsApiServiceArgs = lmsApiServiceArgs;
    });
  });
  describe('lmsApiServiceArgs', () => {
    it('gathers formatted data from state for various lms api service calls', () => {
      selectors.cohorts.getCohortNameById = mockFn('getCohortNameById');
      selectors.filters.selectedAssignmentId = mockFn('selectedAssignmentId');
      selectors.filters.assignmentType = mockFn('assignmentType');
      selectors.filters.cohort = mockFn('cohort');
      selectors.filters.track = mockFn('track');
      selectors.filters.assignmentGradeMax = mockFn('assignmentGradeMax');
      selectors.filters.assignmentGradeMin = mockFn('assignmentGradeMin');
      selectors.filters.courseGradeMax = mockFn('courseGradeMax');
      selectors.filters.courseGradeMin = mockFn('courseGradeMin');
      selectors.filters.excludedCourseRoles = mockFn('excludedCourseRoles');
      selectors.grades.formatMaxAssignmentGrade = mockMetaFn('formatMaxAssignmentGrade');
      selectors.grades.formatMinAssignmentGrade = mockMetaFn('formatMinAssignmentGrade');
      selectors.grades.formatMinCourseGrade = mockFn('formatMinCourseGrade');
      selectors.grades.formatMaxCourseGrade = mockFn('formatMaxCourseGrade');
      const assignmentId = { selectedAssignmentId: testState };
      expect(moduleSelectors.lmsApiServiceArgs(testState)).toEqual({
        cohort: { getCohortNameById: testState },
        track: { track: testState },
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
        excludedCourseRoles: { excludedCourseRoles: testState },
      });
    });
  });
  describe('localFilters', () => {
    const id = 'assignmentID';
    const includeCourseRoleMembers = 'Banana';
    const formattedGradeLimits = ({ some: 'limits' });
    const oldFormattedGradeLimits = moduleSelectors.formattedGradeLimits;
    const selector = moduleSelectors.localFilters;
    beforeEach(() => {
      moduleSelectors.formattedGradeLimits = jest.fn(() => formattedGradeLimits);
      selectors.filters.selectedAssignmentId = jest.fn(() => id);
      selectors.filters.includeCourseRoleMembers = jest.fn(() => includeCourseRoleMembers);
    });
    afterEach(() => {
      moduleSelectors.formattedGradeLimits = oldFormattedGradeLimits;
    });
    describe('searchValue is set', () => {
      const searchText = 'Who dis?';
      beforeEach(() => {
        selectors.app.searchValue = jest.fn(() => searchText);
      });
      it('returns all local filter values, formatted for fetchGrades', () => {
        expect(selector(testState)).toEqual({
          assignment: id,
          includeCourseRoleMembers,
          ...formattedGradeLimits,
          searchText,
        });
      });
    });
    describe('searchValue is not set (is empty string)', () => {
      beforeEach(() => {
        selectors.app.searchValue = jest.fn(() => '');
      });
      it('returns all local filter values except searchText, formatted for fetchGrades', () => {
        expect(selector(testState)).toEqual({
          assignment: id,
          includeCourseRoleMembers,
          ...formattedGradeLimits,
        });
      });
    });
  });
  describe('selectedCohortEntry', () => {
    it('returns the selected cohort entry object', () => {
      const cohorts = [
        { id: 11, name: 'C-a' },
        { id: 22, name: 'C-b' },
        { id: 33, name: 'C-c' },
      ];
      selectors.cohorts.allCohorts = jest.fn(() => cohorts);
      selectors.filters.cohort = jest.fn(() => `${cohorts[1].id}`);
      expect(moduleSelectors.selectedCohortEntry(testState)).toEqual(cohorts[1]);
    });
  });
  describe('selectedTrackEntry', () => {
    it('returns the selected track entry object', () => {
      const tracks = [
        { slug: 'S1', name: 's-a' },
        { slug: 'S2', name: 's-b' },
        { slug: 'S3', name: 's-c' },
      ];
      selectors.tracks.allTracks = jest.fn(() => tracks);
      selectors.filters.track = jest.fn(() => tracks[2].slug);
      expect(moduleSelectors.selectedTrackEntry(testState)).toEqual(tracks[2]);
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
  describe('showBulkManagement', () => {
    const selector = moduleSelectors.showBulkManagement;
    const mkState = (bulkManagementAvailable) => ({ config: { bulkManagementAvailable } });
    it('returns true when bulk management is enabled for the course', () => {
      expect(selector(mkState(true))).toEqual(true);
    });
    it('returns false when bulk management is not enabled for the course', () => {
      expect(selector(mkState(false))).toEqual(false);
    });
  });
});
