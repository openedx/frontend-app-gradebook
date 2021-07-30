import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  emailHeading: {
    id: 'gradebook.GradesTab.table.headings.email',
    defaultMessage: 'Email',
    description: 'Gradebook table email column header',
  },
  totalGradeHeading: {
    id: 'gradebook.GradesTab.table.headings.totalGrade',
    defaultMessage: 'Total Grade (%)',
    description: 'Gradebook table total grade column header',
  },
  usernameHeading: {
    id: 'gradebook.GradesTab.table.headings.username',
    defaultMessage: 'Username',
    description: 'Gradebook table username column header',
  },
  studentKeyLabel: {
    id: 'gradebook.GradesTab.table.labels.studentKey',
    defaultMessage: 'Student Key*',
    description: 'Gradebook table Student Key label',
  },
  usernameLabel: {
    id: 'gradebook.GradesTab.table.labels.username',
    defaultMessage: 'Username',
    description: 'Gradebook table username label',
  },
  totalGradePercentage: {
    id: 'gradebook.GradesTab.table.totalGradePercentage',
    defaultMessage: 'Total Grade values are always displayed as a percentage',
    description: 'Gradebook table message that total grades are displayed in percent format',
  },
});

export default messages;
