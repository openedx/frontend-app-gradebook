import selectors from './special';

describe('hasSpecialBulkManagementAccess', () => {
  // Copy & restore process for testing purposes
  const OLD_ENV = process.env;
  const allowedCourses = ['edX/DemoX/2021T1', 'edX/DemoX/2021T2'];
  const nonSpecialAccessCourse = 'edx/normal/course';

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns true if the course has special access to bulk management', () => {
    process.env.BULK_MANAGEMENT_SPECIAL_ACCESS_COURSE_IDS = `${allowedCourses.join(',')}`;
    const hasSpecialBulkManagementAccess = selectors.hasSpecialBulkManagementAccess(allowedCourses[0]);
    expect(hasSpecialBulkManagementAccess).toBeTruthy();
  });

  it('returns false if the course does not have special access to bulk management', () => {
    const hasSpecialBulkManagementAccess = selectors.hasSpecialBulkManagementAccess(nonSpecialAccessCourse);
    expect(hasSpecialBulkManagementAccess).toBeFalsy();
  });
});
