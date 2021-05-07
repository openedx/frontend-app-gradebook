import selectors from '.';
import LmsApiService from '../services/LmsApiService';

describe('root', () => {
  const testCourseId = 'OxfordX+Time+Travel';

  const baseApiArgs = {
    assignment: 'block-v1:edX+Term+type@sequential+block@1',
    assignmentGradeMax: '99',
    assignmentGradeMin: '1',
    assignmentType: 'Homework',
    cohort: 'test cohort',
    courseGradeMax: '98',
    courseGradeMin: '2',
  };

  beforeEach(() => {
    selectors.cohorts.getCohortNameById = jest.fn(() => 'test cohort');
    selectors.filters.assignmentType = jest.fn(() => 'Homework');
    selectors.filters.includeCourseRoleMembers = jest.fn();
    selectors.filters.selectedAssignmentId = jest.fn(() => 'block-v1:edX+Term+type@sequential+block@1');
    selectors.grades.formatMaxAssignmentGrade = jest.fn(() => '99');
    selectors.grades.formatMinAssignmentGrade = jest.fn(() => '1');
    selectors.grades.formatMaxCourseGrade = jest.fn(() => '98');
    selectors.grades.formatMinCourseGrade = jest.fn(() => '2');

    // Internal functions, intentionally left blank
    selectors.filters.assignmentGradeMax = jest.fn();
    selectors.filters.assignmentGradeMin = jest.fn();
    selectors.filters.cohort = jest.fn();
    selectors.filters.courseGradeMin = jest.fn();
    selectors.filters.courseGradeMax = jest.fn();
  });

  describe('getHeadings', () => {
    const mockHeadingMapper = jest.fn();

    beforeEach(() => {
      // Note: the mock setup for this is gross which I'd argue speaks to the need for refactoring.
      mockHeadingMapper.mockReturnValue(() => (() => []));

      selectors.grades.headingMapper = mockHeadingMapper;
      selectors.filters.selectedAssignmentLabel = jest.fn();
      selectors.grades.getExampleSectionBreakdown = jest.fn();
    });

    it('uses all assignment types for creating headings when no type/assignment filters are supplied', () => {
      selectors.filters.assignmentType.mockReturnValue(undefined);
      selectors.filters.selectedAssignmentLabel.mockReturnValue(undefined);
      selectors.root.getHeadings({});
      expect(mockHeadingMapper).toHaveBeenCalledWith('All', 'All');
    });

    it('filters headings by assignment type when type filter is applied', () => {
      selectors.filters.assignmentType.mockReturnValue('Homework');
      selectors.filters.selectedAssignmentLabel.mockReturnValue(undefined);
      selectors.root.getHeadings({});
      expect(mockHeadingMapper).toHaveBeenCalledWith('Homework', 'All');
    });

    it('filters headings by assignment when a type and assignment filter are applied', () => {
      selectors.filters.assignmentType.mockReturnValue('Homework');
      selectors.filters.selectedAssignmentLabel.mockReturnValue('HW 42');
      selectors.root.getHeadings({});
      expect(mockHeadingMapper).toHaveBeenCalledWith('Homework', 'HW 42');
    });
  });

  describe('gradeExportUrl', () => {
    it('calls the API service with the right args, excluding all course roles', () => {
      const testState = {};
      const mockGetExportUrl = jest.fn();
      const expectedApiArgs = { ...baseApiArgs, excludeCourseRoles: 'all' };

      LmsApiService.getGradeExportCsvUrl = mockGetExportUrl;

      selectors.root.gradeExportUrl(testState, { courseId: testCourseId });
      expect(mockGetExportUrl).toHaveBeenCalledWith(testCourseId, expectedApiArgs);
    });
    it('calls the API service with the right args, including course roles when the option is selected', () => {
      const testState = {};
      const mockGetExportUrl = jest.fn();
      const expectedApiArgs = { ...baseApiArgs, excludeCourseRoles: '' };
      selectors.filters.includeCourseRoleMembers.mockReturnValue(true);

      LmsApiService.getGradeExportCsvUrl = mockGetExportUrl;

      selectors.root.gradeExportUrl(testState, { courseId: testCourseId });
      expect(mockGetExportUrl).toHaveBeenCalledWith(testCourseId, expectedApiArgs);
    });
  });

  describe('interventionExportUrl', () => {
    it('calls the API service with the right args', () => {
      const testState = {};
      const mockGetExportUrl = jest.fn();

      LmsApiService.getInterventionExportCsvUrl = mockGetExportUrl;

      selectors.root.interventionExportUrl(testState, { courseId: testCourseId });
      expect(mockGetExportUrl).toHaveBeenCalledWith(testCourseId, baseApiArgs);
    });
  });

  describe('showBulkManagement', () => {
    let state = {};

    beforeEach(() => {
      const templateState = { config: { bulkManagementAvailable: true } };
      state = { ...templateState };

      selectors.special.hasSpecialBulkManagementAccess = jest.fn(() => (false));
      selectors.tracks.stateHasMastersTrack = jest.fn(() => (false));
    });

    it('does not show bulk management when the course does not have a masters track', () => {
      expect(selectors.root.showBulkManagement(state, { courseId: 'foo' })).toEqual(false);
    });
    it('shows bulk management when the course has a masters track', () => {
      selectors.tracks.stateHasMastersTrack = jest.fn(() => (true));
      expect(selectors.root.showBulkManagement(state, { courseId: 'foo' })).toEqual(true);
    });
    it('shows bulk management when a course is configured for special access, regardless of other settings', () => {
      selectors.special.hasSpecialBulkManagementAccess = jest.fn(() => (true));
      expect(selectors.root.showBulkManagement(state, { courseId: 'foo' })).toEqual(true);
    });
    it('does not show bulk management when bulk management is not available', () => {
      selectors.tracks.stateHasMastersTrack = jest.fn(() => (true));
      state.config.bulkManagementAvailable = false;
      expect(selectors.root.showBulkManagement(state, { courseId: 'foo' })).toEqual(false);
    });
  });

  describe('shouldShowSpinner', () => {
    it('does not show the spinner if the user cannot view Gradebook', () => {
      selectors.roles.canUserViewGradebook = jest.fn(() => (false));
      expect(selectors.root.shouldShowSpinner()).toEqual(false);
    });
    it('shows the spinner when a grades task is processing', () => {
      selectors.roles.canUserViewGradebook = jest.fn(() => (true));
      selectors.grades.showSpinner = jest.fn(() => (true));
      expect(selectors.root.shouldShowSpinner()).toEqual(true);
    });
    it('stops showing the spinner when a grades task is not processing', () => {
      selectors.roles.canUserViewGradebook = jest.fn(() => (true));
      selectors.grades.showSpinner = jest.fn(() => (false));
      expect(selectors.root.shouldShowSpinner()).toEqual(false);
    });
  });
});
