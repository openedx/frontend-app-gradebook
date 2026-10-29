import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  assignmentGradeRangeInvalid: {
    id: 'gradebook.GradesView.assignmentGradeRangeInvalid',
    defaultMessage: 'Minimum assignment grade cannot be greater than the maximum assignment grade',
    description: 'An alert text for selecting a minimum assignment grade greater than the maximum assignment grade',
  },
  courseGradeRangeInvalid: {
    id: 'gradebook.GradesView.courseGradeRangeInvalid',
    defaultMessage: 'Minimum course grade cannot be greater than the maximum course grade',
    description: 'An alert text for selecting a minimum course grade greater than the maximum course grade',
  },
  editSuccessAlert: {
    id: 'gradebook.GradesView.editSuccessAlert',
    defaultMessage: 'The grade has been successfully edited.  You may see a slight delay before updates appear in the Gradebook.',
    description: 'An alert text for successfully editing  a grade',
  },
  maxAssignmentGradeInvalid: {
    id: 'gradebook.GradesView.maxAssignmentGradeInvalid',
    defaultMessage: 'Maximum assignment grade must be 0 or greater',
    description: 'An alert text for selecting a maximum assignment grade less than 0',
  },
  maxGradeInvalid: {
    id: 'gradebook.GradesView.maxCourseGradeInvalid',
    defaultMessage: 'Maximum course grade must be between 0 and 100',
    description: 'An alert text for selecting a maximum course grade greater than 100',
  },
  minAssignmentGradeInvalid: {
    id: 'gradebook.GradesView.minAssignmentGradeInvalid',
    defaultMessage: 'Minimum assignment grade must be 0 or greater',
    description: 'An alert text for selecting a minimum assignment grade less than 0',
  },
  minGradeInvalid: {
    id: 'gradebook.GradesView.minCourseGradeInvalid',
    defaultMessage: 'Minimum course grade must be between 0 and 100',
    description: 'An alert text for selecting a minimum course grade less than 0',
  },
});

export default messages;
