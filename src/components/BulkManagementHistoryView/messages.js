import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  csvUploadLabel: {
    id: 'gradebook.BulkManagementTab.csvUploadLabel',
    defaultMessage: 'Upload Grade CSV',
    description: 'Button in BulkManagementTab Alerts',
  },
  heading: {
    id: 'gradebook.BulkManagementTab.heading',
    defaultMessage: 'Use this feature by downloading a CSV for bulk management, overriding grades locally, and coming back here to upload.',
    description: 'Heading text for BulkManagement Tab',
  },
  hint1: {
    id: 'gradebook.BulkManagementTab.hint1',
    defaultMessage: 'Results appear in the table below.',
    description: 'Hint text on BulkManagement Tab History Table',
  },
  hint2: {
    id: 'gradebook.BulkManagementTab.hint2',
    defaultMessage: 'Grade processing may take a few seconds.',
    description: 'Hint text on BulkManagement Tab History Table',
  },
  importBtnText: {
    id: 'gradebook.BulkManagementTab.importBtnText',
    defaultMessage: 'Import Grades',
    description: 'Button in BulkManagement Tab File Upload Form',
  },
  successDialog: {
    id: 'gradebook.BulkManagementTab.successDialog',
    defaultMessage: 'CSV processing. File uploads may take several minutes to complete.',
    description: 'Success Dialog message in BulkManagement Tab File Upload Form',
  },
});

export default messages;
