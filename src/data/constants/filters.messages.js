import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  assignment: {
    id: 'gradebook.GradesTab.FilterBadges.assignment',
    defaultMessage: 'Assignment',
    description: 'A label describing the notification under the "Edit Filters" button that shows by which of the course\'s assignments the view is being filtered.',
  },
  assignmentGrade: {
    id: 'gradebook.GradesTab.FilterBadges.assignmentGrade',
    defaultMessage: 'Assignment Grade',
    description: 'A label describing the notification under the "Edit Filters" button that shows that the view is being filtered to include assignment grades within the alloted range.',
  },
  assignmentType: {
    id: 'gradebook.GradesTab.FilterBadges.assignmentType',
    defaultMessage: 'Assignment Type',
    description: 'A label describing the notification under the "Edit Filters" button that shows by which of the course\'s assignment types the view is being filtered.',
  },
  cohort: {
    id: 'gradebook.GradesTab.FilterBadges.cohort',
    defaultMessage: 'Cohort',
    description: 'A label describing the notification under the "Edit Filters" button that shows by which of the course\'s cohorts the view is being filtered.',
  },
  courseGrade: {
    id: 'gradebook.GradesTab.FilterBadges.courseGrade',
    defaultMessage: 'Course Grade',
    description: 'A label describing the notification under the "Edit Filters" button that shows that the view is being filtered to include course grades within the alloted range.',
  },
  includeCourseRoleMembers: {
    id: 'gradebook.GradesTab.FilterBadges.includeCourseRoleMembers',
    defaultMessage: 'Include Course Team Members',
    description: 'A label describing the notification under the "Edit Filters" button that shows that the view is being filtered to include course team members.',
  },
  track: {
    id: 'gradebook.GradesTab.FilterBadges.track',
    defaultMessage: 'Track',
    description: 'A label describing the notification under the "Edit Filters" button that shows by which of the course\'s tracks the view is being filtered.',
  },
});

export default messages;
