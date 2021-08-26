import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  editSuccessAlert: {
    id: 'gradebook.GradesView.editSuccessAlert',
    defaultMessage: 'The grade has been successfully edited.  You may see a slight delay before updates appear in the Gradebook.',
    description: 'Alert text for successful edit action',
  },
  maxGradeInvalid: {
    id: 'gradebook.GradesView.maxCourseGradeInvalid',
    defaultMessage: 'Maximum course grade must be between 0 and 100',
    description: 'Alert text for invalid maximum course grade',
  },
  minGradeInvalid: {
    id: 'gradebook.GradesView.minCourseGradeInvalid',
    defaultMessage: 'Minimum course grade must be between 0 and 100',
    description: 'Alert text for invalid minimum course grade',
  },
});

export default messages;
