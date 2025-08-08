import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  filterStepHeading: {
    id: 'gradebook.GradesView.filterHeading',
    defaultMessage: 'Step 1: Filter the Grade Report',
    description: 'Filter controls container heading string',
  },
  gradebookStepHeading: {
    id: 'gradebook.GradesView.gradebookStepHeading',
    defaultMessage: 'Step 2: View or Modify Individual Grades',
    description: 'Alert text for invalid minimum course grade',
  },
  mastersHint: {
    id: 'gradebook.GradesView.mastersHint',
    defaultMessage: "available for learners in the Master's track only",
    description: 'Masters feature availability hint on Grades Tab',
  },
  spinnerScreenReaderText: {
    id: 'gradebook.GradesView.spinnerScreenReaderText',
    defaultMessage: 'Loading...',
    description: 'Screen reader text for loading spinner',
  },
});

export default messages;
