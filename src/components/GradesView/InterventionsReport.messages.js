import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'gradebook.GradesView.InterventionsReport.title',
    defaultMessage: 'Interventions Report',
    description: 'Intervention report subsection label',
  },
  description: {
    id: 'gradebook.GradesView.InterventionsReport.description',
    defaultMessage: 'Need to find students who may be falling behind?  Download the interventions report to obtain engagement metrics such as section attempts and visits.',
    description: 'Intervention report subsection description',
  },
  downloadBtn: {
    id: 'gradebook.GradesView.InterventionsReport.downloadBtn',
    defaultMessage: 'Download Interventions',
    description: 'Button text for intervention report download control in GradesView',
  },
});

export default messages;
