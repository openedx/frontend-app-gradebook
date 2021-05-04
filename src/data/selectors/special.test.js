import selectors from './special';

describe('hasSpecialBulkManagementAccess', () => {
  // Copy & restore process for testing purposes
  const OLD_ENV = process.env;
  const allowedCourses = 'edX/DemoX/2021T1,edX/DemoX/2021T2';

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns true if the course has special access to bulk management', () => {
    process.env.BULK_MANAGEMENT_SPECIAL_ACCESS_COURSE_IDS = allowedCourses;
    const hasSpecialBulkManagementAccess = selectors.hasSpecialBulkManagementAccess('edX/DemoX/2021T2');
    expect(hasSpecialBulkManagementAccess).toBeTruthy();
  });

  it('returns false if the course does not have special access to bulk management', () => {
    const hasSpecialBulkManagementAccess = selectors.hasSpecialBulkManagementAccess('edx/disallowed/course');
    expect(hasSpecialBulkManagementAccess).toBeFalsy();
  });
});
