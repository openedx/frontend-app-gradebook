import lms from '@src/data/services/lms';
import { allowedRoles, getAssignmentTypes, getCanUserViewGradebook } from './api';

jest.mock('@src/data/services/lms', () => ({
  api: {
    fetch: {
      roles: jest.fn(),
      assignmentTypes: jest.fn(),
    },
  },
}));

const rolesMock = jest.mocked(lms.api.fetch.roles);
const assignmentTypesMock = jest.mocked(lms.api.fetch.assignmentTypes);

describe('gradebook data api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the allow-listed roles', () => {
    expect(allowedRoles).toEqual(['staff', 'limited_staff', 'instructor', 'support']);
  });

  describe('getCanUserViewGradebook', () => {
    it('returns true for staff users regardless of roles', async () => {
      rolesMock.mockResolvedValue({ data: { is_staff: true, roles: [] } });
      await expect(getCanUserViewGradebook('course-v1:X')).resolves.toBe(true);
    });

    it('returns true when the user holds an allowed role in the course', async () => {
      rolesMock.mockResolvedValue({
        data: {
          is_staff: false,
          roles: [{ course_id: 'course-v1:X', role: 'staff' }],
        },
      });
      await expect(getCanUserViewGradebook('course-v1:X')).resolves.toBe(true);
    });

    it('returns false when the allowed role is for a different course', async () => {
      rolesMock.mockResolvedValue({
        data: {
          is_staff: false,
          roles: [{ course_id: 'course-v1:Other', role: 'staff' }],
        },
      });
      await expect(getCanUserViewGradebook('course-v1:X')).resolves.toBe(false);
    });

    it('returns false for roles not in the allow-list', async () => {
      rolesMock.mockResolvedValue({
        data: {
          is_staff: false,
          roles: [{ course_id: 'course-v1:X', role: 'student' }],
        },
      });
      await expect(getCanUserViewGradebook('course-v1:X')).resolves.toBe(false);
    });

    it('handles missing roles array without throwing', async () => {
      rolesMock.mockResolvedValue({ data: {} });
      await expect(getCanUserViewGradebook('course-v1:X')).resolves.toBe(false);
    });
  });

  describe('getAssignmentTypes', () => {
    it('derives the assignment-type keys plus the flags', async () => {
      assignmentTypesMock.mockResolvedValue({
        data: {
          assignment_types: { Homework: {}, Exam: {} },
          grades_frozen: true,
          can_see_bulk_management: true,
        },
      });
      await expect(getAssignmentTypes()).resolves.toEqual({
        assignmentTypes: ['Homework', 'Exam'],
        areGradesFrozen: true,
        bulkManagementAvailable: true,
      });
    });

    it('returns safe defaults for an empty payload', async () => {
      assignmentTypesMock.mockResolvedValue({ data: {} });
      await expect(getAssignmentTypes()).resolves.toEqual({
        assignmentTypes: [],
        areGradesFrozen: false,
        bulkManagementAvailable: false,
      });
    });
  });
});
