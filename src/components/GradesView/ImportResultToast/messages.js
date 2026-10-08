import { defineMessages } from '@edx/frontend-platform/i18n';

// The success ids keep their original `ImportSuccessToast` names: they are already in the
// translation pipeline, and renaming an id orphans every translation of it.
const messages = defineMessages({
  successDescription: {
    id: 'gradebook.GradesView.ImportSuccessToast.description',
    defaultMessage: 'Import Successful! Grades will be updated momentarily.',
    description: 'A message congratulating a successful Import of grades',
  },
  errorDescription: {
    id: 'gradebook.GradesView.ImportErrorToast.description',
    defaultMessage: 'Import failed. {details}',
    description: 'Message shown when a grade import could not be applied',
  },
  showHistoryViewBtn: {
    id: 'gradebook.GradesView.ImportSuccessToast.showHistoryViewBtn',
    defaultMessage: 'View Activity Log',
    description: 'The text on a button that loads a view of the Bulk Management Activity Log',
  },
});

export default messages;
