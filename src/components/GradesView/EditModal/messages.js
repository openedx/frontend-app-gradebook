import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  assignmentHeader: {
    id: 'gradebook.GradesView.EditModal.headers.assignment',
    defaultMessage: 'Assignment',
    description: 'Edit Modal Assignment header',
  },
  currentGradeHeader: {
    id: 'gradebook.GradesView.EditModal.headers.currentGrade',
    defaultMessage: 'Current Grade',
    description: 'Edit Modal Current Grade header',
  },
  originalGradeHeader: {
    id: 'gradebook.GradesView.EditModal.headers.originalGrade',
    defaultMessage: 'Original Grade',
    description: 'Edit Modal Original Grade header',
  },
  studentHeader: {
    id: 'gradebook.GradesView.EditModal.headers.student',
    defaultMessage: 'Student',
    description: 'Edit Modal Student header',
  },
  title: {
    id: 'gradebook.GradesView.EditModal.title',
    defaultMessage: 'Edit Grades',
    description: 'Edit Modal title',
  },
  closeText: {
    id: 'gradebook.GradesView.EditModal.closeText',
    defaultMessage: 'Cancel',
    description: 'Edit Modal close button text',
  },
  visibility: {
    id: 'gradebook.GradesView.EditModal.contactSupport',
    defaultMessage: 'Showing most recent actions (max 5). To see more, please contact support',
    description: 'Edit Modal visibility hint message',
  },
  saveVisibility: {
    id: 'gradebook.GradesView.EditModal.saveVisibility',
    defaultMessage: 'Note: Once you save, your changes will be visible to students.',
    description: 'Edit Modal saved changes effect hint',
  },
  saveGrade: {
    id: 'gradebook.GradesView.EditModal.saveGrade',
    defaultMessage: 'Save Grades',
    description: 'Edit Modal Save button label',
  },
});

export default messages;
