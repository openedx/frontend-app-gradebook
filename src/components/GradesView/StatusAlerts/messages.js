import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  editSuccessAlert: {
    id: 'gradebook.GradesView.editSuccessAlert',
    defaultMessage: 'The grade has been successfully edited.  You may see a slight delay before updates appear in the Gradebook.',
    description: 'An alert text for successfully editing  a grade',
  },
  maxGradeInvalid: {
    id: 'gradebook.GradesView.maxCourseGradeInvalid',
    defaultMessage: 'Maximum course grade must be between 0 and 100',
    description: 'An alert text for selecting a maximum course grade greater than 100',
  },
  minGradeInvalid: {
    id: 'gradebook.GradesView.minCourseGradeInvalid',
    defaultMessage: 'Minimum course grade must be between 0 and 100',
    description: 'An alert text for selecting a minimum course grade less than 0',
  },
  minLessMaxGradeInvalid: {
    id: 'gradebook.GradesView.minLessMaxGradeInvalid',
    defaultMessage: 'Minimum course grade must be less than maximum course grade',
    description: 'An alert text for selecting a minimum course grade must be less than maximum course grade',
  },
  maxAssignmentInvalid: {
    id: 'gradebook.GradesView.maxAssignmentGradeInvalid',
    defaultMessage: 'Maximum assignment grade must be between 0 and 100',
    description: 'An alert text for selecting a maximum assignment grade greater than 100',
  },
  minAssignmentInvalid: {
    id: 'gradebook.GradesView.minAssignmentGradeInvalid',
    defaultMessage: 'Minimum assignment grade must be between 0 and 100',
    description: 'An alert text for selecting a minimum assignment grade less than 0',
  },
  minLessMaxAssignmentInvalid: {
    id: 'gradebook.GradesView.minLessMaxAssignmentInvalid',
    defaultMessage: 'Minimum assignment grade must be less than maximum assignment grade',
    description: 'An alert text for selecting a minimum assignment grade must be less than maximum assignment grade',
  },
});

export default messages;
