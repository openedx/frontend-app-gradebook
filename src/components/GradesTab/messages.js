import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  bulkManagement: {
    id: 'gradebook.GradesTab.BulkManagementControls.bulkManagementLabel',
    defaultMessage: 'Bulk Management',
    description: 'Button text for bulk grades download control in GradesTab',
  },
  interventions: {
    id: 'gradebook.GradesTab.BulkManagementControls.interventionsLabel',
    defaultMessage: 'Interventions',
    description: 'Button text for intervention report download control in GradesTab',
  },
  scoreView: {
    id: 'gradebook.GradesTab.scoreViewLabel',
    defaultMessage: 'Score View',
    description: 'Score format select dropdown label',
  },
  absolute: {
    id: 'gradebook.GradesTab.absoluteOption',
    defaultMessage: 'Absolute',
    description: 'Score format select dropdown option',
  },
  percent: {
    id: 'gradebook.GradesTab.percentOption',
    defaultMessage: 'Percent',
    description: 'Score format select dropdown option',
  },
  filterStepHeading: {
    id: 'gradebook.GradesTab.filterHeading',
    defaultMessage: 'Step 1: Filter the Grade Report',
    description: 'Filter controls container heading string',
  },
  editFilters: {
    id: 'gradebook.GradesTab.editFilterLabel',
    defaultMessage: 'Edit Filters',
    description: 'Button text on Grades tab to open/close the Filters tab',
  },
  searchLabel: {
    id: 'gradebook.GradesTab.search.label',
    defaultMessage: 'Search for a learner',
    description: 'Search description label',
  },
  searchHint: {
    id: 'gradebook.GradesTab.search.hint',
    defaultMessage: 'Search by username, email, or student key',
    description: 'Search hint label',
  },
  editSuccessAlert: {
    id: 'gradebook.GradesTab.editSuccessAlert',
    defaultMessage: 'The grade has been successfully edited.  You may see a slight delay before updates appear in the Gradebook.',
    description: 'Alert text for successful edit action',
  },
  maxGradeInvalid: {
    id: 'gradebook.GradesTab.maxCourseGradeInvalid',
    defaultMessage: 'Maximum course grade must be between 0 and 100',
    description: 'Alert text for invalid maximum course grade',
  },
  minGradeInvalid: {
    id: 'gradebook.GradesTab.minCourseGradeInvalid',
    defaultMessage: 'Minimum course grade must be between 0 and 100',
    description: 'Alert text for invalid minimum course grade',
  },
  gradebookStepHeading: {
    id: 'gradebook.GradesTab.gradebookStepHeading',
    defaultMessage: 'Step 2: View or Modify Individual Grades',
    description: 'Alert text for invalid minimum course grade',
  },
  mastersHint: {
    id: 'gradebook.GradesTab.mastersHint',
    defaultMessage: 'available for learners in the Master&apos;s track only',
    description: 'Masters feature availability hint on Grades Tab',
  },
});

export default messages;
