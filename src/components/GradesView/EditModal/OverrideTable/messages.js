import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  adjustedGradeExceedsPossible: {
    id: 'gradebook.GradesView.EditModal.Overrides.adjustedGradeExceedsPossible',
    defaultMessage: '{adjustedGrade} is more than the available number of points for this assignment ({possibleGrade}). Are you sure you\'d like to proceed?',
    description: 'Edit Modal Override Table warning shown when the adjusted grade is greater than the possible grade',
  },
  adjustedGradeHeader: {
    id: 'gradebook.GradesView.EditModal.Overrides.adjustedGradeHeader',
    defaultMessage: 'Adjusted grade',
    description: 'Edit Modal Override Table Adjusted grade column header',
  },
  adjustedGradeInvalid: {
    id: 'gradebook.GradesView.EditModal.Overrides.adjustedGradeInvalid',
    defaultMessage: 'Enter a number that is 0 or greater.',
    description: 'Edit Modal Override Table error shown when the adjusted grade is not a non-negative number',
  },
  dateHeader: {
    id: 'gradebook.GradesView.EditModal.Overrides.dateHeader',
    defaultMessage: 'Date',
    description: 'Edit Modal Override Table Date column header',
  },
  graderHeader: {
    id: 'gradebook.GradesView.EditModal.Overrides.graderHeader',
    defaultMessage: 'Grader',
    description: 'Edit Modal Override Table Grader column header',
  },
  reasonHeader: {
    id: 'gradebook.GradesView.EditModal.Overrides.reasonHeader',
    defaultMessage: 'Reason',
    description: 'Edit Modal Override Table Reason column header',
  },
});

export default messages;
