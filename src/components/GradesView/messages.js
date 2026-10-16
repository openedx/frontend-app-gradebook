import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  filterStepHeading: {
    id: 'gradebook.GradesView.filterHeadingV2',
    defaultMessage: 'Filter the Grade Report',
    description: 'Filter controls container heading string',
  },
  gradebookStepHeading: {
    id: 'gradebook.GradesView.gradebookStepHeadingV2',
    defaultMessage: 'View or Modify Individual Grades',
    description: 'Gradebook table container heading string',
  },
  unknownImportError: {
    id: 'gradebook.GradesView.unknownImportError',
    defaultMessage: 'Unknown error.',
    description: 'Shown when a grade import fails without the server saying why',
  },
  mastersHint: {
    id: 'gradebook.GradesView.mastersHint',
    defaultMessage: "available for learners in the Master's track only",
    description: 'Masters feature availability hint on Grades Tab',
  },
});

export default messages;
