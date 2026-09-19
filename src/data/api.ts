import lms from '@src/data/services/lms';

/** LMS course roles that grant permission to view the gradebook. */
export const allowedRoles = ['staff', 'limited_staff', 'instructor', 'support'];

interface CourseRole {
  course_id: string;
  role: string;
}

/** Derived assignment-type data consumed by filters and the header. */
export interface AssignmentTypesData {
  assignmentTypes: string[];
  areGradesFrozen: boolean;
  bulkManagementAvailable: boolean;
}

/**
 * getCanUserViewGradebook(courseId)
 * Fetches the current user's roles and derives whether they may view the
 * gradebook for this course (staff, or holding an allowed role in the course).
 */
export const getCanUserViewGradebook = async (courseId: string): Promise<boolean> => {
  const { data } = await lms.api.fetch.roles();
  const isAllowedRole = (role: CourseRole) => (
    role.course_id === courseId && allowedRoles.includes(role.role)
  );
  return Boolean(data.is_staff || (data.roles || []).some(isAllowedRole));
};

/**
 * getAssignmentTypes()
 * Fetches grading info and derives the assignment-type list plus the
 * grades-frozen and bulk-management flags that ride along with it.
 */
export const getAssignmentTypes = async (): Promise<AssignmentTypesData> => {
  const { data } = await lms.api.fetch.assignmentTypes();
  return {
    assignmentTypes: Object.keys(data.assignment_types || {}),
    areGradesFrozen: Boolean(data.grades_frozen),
    bulkManagementAvailable: Boolean(data.can_see_bulk_management),
  };
};
