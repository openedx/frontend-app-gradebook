import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'gradebook.GradesView.InterventionsReport.title',
    defaultMessage: 'Interventions Report',
    description: 'The title for the Intervention report subsection',
  },
  description: {
    id: 'gradebook.GradesView.InterventionsReport.description',
    defaultMessage: 'Need to find students who may be falling behind?  Download the interventions report to obtain engagement metrics such as section attempts and visits.',
    description: 'The description for the Intervention report subsection',
  },
  downloadBtn: {
    id: 'gradebook.GradesView.InterventionsReport.downloadBtn',
    defaultMessage: 'Download Interventions',
    description: 'The labeled button to download the Intervention report from the Grades View',
  },
});

export default messages;
