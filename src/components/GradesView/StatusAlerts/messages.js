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
});

export default messages;
