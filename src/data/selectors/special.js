// Certain course runs may be expressly allowed to view the
// bulk management tools, bypassing the other checks.
// Note that this does not affect whether or not the backend
// LMS API will permit usage of the tool.

const selectors = {
  /**
   * hasSpecialBulkManagementAccess(courseId)
   * Returns true iff the bulk management special access course ids env variable includes
   * the linked course id.
   * @param {string} courseId - linked course id
   * @param {bool} - course has special bulk management access?
   */
  hasSpecialBulkManagementAccess: (courseId) => {
    const specialIdList = process.env.BULK_MANAGEMENT_SPECIAL_ACCESS_COURSE_IDS || '';
    return specialIdList.split(',').includes(courseId);
  },
};

export default selectors;
