import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  backToDashboard: {
    id: 'gradebook.GradebookHeader.backButton',
    defaultMessage: 'Back to Dashboard',
    description: 'Button text to take user back to LMS dashboard in Gradebook Header',
  },
  gradebook: {
    id: 'gradebook.GradebookHeader.appLabel',
    defaultMessage: 'Gradebook',
    description: 'Top-level app title in Gradebook Header component',
  },
  frozenWarning: {
    id: 'gradebook.GradebookHeader.frozenWarning',
    defaultMessage: 'The grades for this course are now frozen. Editing of grades is no longer allowed.',
    description: 'Warning message in Gradebook Header for frozen messages',
  },
  unauthorizedWarning: {
    id: 'gradebook.GradebookHeader.unauthorizedWarning',
    defaultMessage: 'You are not authorized to view the gradebook for this course.',
    description: 'Warning message in Gradebook Header when user is not allowed to view the app',
  },
});

export default messages;
