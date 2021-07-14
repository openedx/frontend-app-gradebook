import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  assignmentHeader: {
    id: 'gradebook.GradesTab.EditModal.headers.assignment',
    defaultMessage: 'Assignment',
    description: 'Edit Modal Assignment header',
  },
  currentGradeHeader: {
    id: 'gradebook.GradesTab.EditModal.headers.currentGrade',
    defaultMessage: 'Current Grade',
    description: 'Edit Modal Current Grade header',
  },
  originalGradeHeader: {
    id: 'gradebook.GradesTab.EditModal.headers.originalGrade',
    defaultMessage: 'Original Grade',
    description: 'Edit Modal Original Grade header',
  },
  studentHeader: {
    id: 'gradebook.GradesTab.EditModal.headers.student',
    defaultMessage: 'Student',
    description: 'Edit Modal Student header',
  },
  title: {
    id: 'gradebook.GradesTab.EditModal.title',
    defaultMessage: 'Edit Grades',
    description: 'Edit Modal title',
  },
  closeText: {
    id: 'gradebook.GradesTab.EditModal.closeText',
    defaultMessage: 'Cancel',
    description: 'Edit Modal close button text',
  },
  visibility: {
    id: 'gradebook.GradesTab.EditModal.contactSupport',
    defaultMessage: 'Showing most recent actions (max 5). To see more, please contact support',
    description: 'Edit Modal visibility hint message',
  },
  saveVisibility: {
    id: 'gradebook.GradesTab.EditModal.saveVisibility',
    defaultMessage: 'Note: Once you save your changes will be visible to students.',
    description: 'Edit Modal saved changes effect hint',
  },
  saveGrade: {
    id: 'gradebook.GradesTab.EditModal.saveGrade',
    defaultMessage: 'Save Gradse',
    description: 'Edit Modal Save button label',
  },
});

export default messages;
