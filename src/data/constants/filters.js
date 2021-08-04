import { StrictDict } from 'utils';

import messages from './filters.messages';

export const filters = StrictDict({
  assignment: 'assignment',
  assignmentGrade: 'assignmentGrade',
  assignmentGradeMax: 'assignmentGradeMax',
  assignmentGradeMin: 'assignmentGradeMin',
  assignmentType: 'assignmentType',
  cohort: 'cohort',
  courseGrade: 'courseGrade',
  courseGradeMax: 'courseGradeMax',
  courseGradeMin: 'courseGradeMin',
  excludedCourseRoles: 'excludedCourseRoles',
  includeCourseRoleMembers: 'includeCourseRoleMembers',
  track: 'track',
});

const initialFilters = {
  [filters.assignment]: '',
  [filters.assignmentGradeMax]: '100',
  [filters.assignmentGradeMin]: '0',
  [filters.assignmentType]: '',
  [filters.cohort]: '',
  [filters.courseGradeMax]: '100',
  [filters.courseGradeMin]: '0',
  [filters.includeCourseRoleMembers]: false,
  [filters.track]: '',
};

export const filterConfig = StrictDict({
  [filters.assignment]: {
    displayName: messages[filters.assignment],
    connectedFilters: ['assignment', 'assignmentGradeMax', 'assignmentGradeMax'],
  },
  [filters.assignmentType]: {
    displayName: messages[filters.assignmentType],
    connectedFilters: ['assignmentType'],
  },
  [filters.assignmentGrade]: {
    displayName: messages[filters.assignmentGrade],
    filterOrder: ['assignmentGradeMin', 'assignmentGradeMax'],
    connectedFilters: ['assignmentGradeMax', 'assignmentGradeMin'],
  },
  [filters.cohort]: {
    displayName: messages[filters.cohort],
    connectedFilters: ['cohort'],
  },
  [filters.courseGrade]: {
    displayName: messages[filters.courseGrade],
    filterOrder: ['courseGradeMin', 'courseGradeMax'],
    connectedFilters: ['courseGradeMax', 'courseGradeMin'],
  },
  [filters.includeCourseRoleMembers]: {
    displayName: messages[filters.includeCourseRoleMembers],
    connectedFilters: ['includeCourseRoleMembers'],
    hideValue: true,
  },
  [filters.track]: {
    displayName: messages[filters.track],
    connectedFilters: ['track'],
  },
});

export const badgeOrder = [
  filters.assignmentType,
  filters.assignment,
  filters.assignmentGrade,
  filters.courseGrade,
  filters.track,
  filters.cohort,
  filters.includeCourseRoleMembers,
];

export default initialFilters;
