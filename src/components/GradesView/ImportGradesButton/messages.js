import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  csvUploadLabel: {
    id: 'gradebook.BulkManagementHistoryView.csvUploadLabel',
    defaultMessage: 'Upload Grade CSV',
    description: 'A labeled button to upload a CSV containing course grades.',
  },
  importGradesBtnText: {
    id: 'gradebook.GradesView.importGradesBtnText',
    defaultMessage: 'Import Grades',
    description: 'A labeled button to import grades in the BulkManagement Tab File Upload Form',
  },
  unknownImportError: {
    id: 'gradebook.GradesView.unknownImportError',
    defaultMessage: 'Unknown error.',
    description: 'Shown when a grade import fails without the server saying why',
  },
});

export default messages;
