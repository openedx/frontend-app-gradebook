import { StrictDict } from 'utils';

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
    displayName: 'Assignment',
    connectedFilters: ['assignment', 'assignmentGradeMax', 'assignmentGradeMax'],
  },
  [filters.assignmentType]: {
    displayName: 'Assignment Type',
    connectedFilters: ['assignmentType'],
  },
  [filters.assignmentGrade]: {
    displayName: 'Assignment Grade',
    filterOrder: ['assignmentGradeMin', 'assignmentGradeMax'],
    connectedFilters: ['assignmentGradeMax', 'assignmentGradeMin'],
  },
  [filters.cohort]: {
    displayName: 'Cohort',
    connectedFilters: ['cohort'],
  },
  [filters.courseGrade]: {
    displayName: 'Course Grade',
    filterOrder: ['courseGradeMin', 'courseGradeMax'],
    connectedFilters: ['courseGradeMax', 'courseGradeMin'],
  },
  [filters.includeCourseRoleMembers]: {
    displayName: 'Includeing Course Team Members',
    connectedFilters: ['includeCourseRoleMembers'],
    hideValue: true,
  },
  [filters.track]: {
    displayName: 'Track',
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
