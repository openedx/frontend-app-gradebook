import { useIntl } from '@openedx/frontend-base';

import { StrictDict } from '@src/utils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useGradeOverrideData } from '@src/components/GradesView/data/hooks';

import messages from './messages';
import HistoryHeader from './HistoryHeader';

export const HistoryKeys = StrictDict({
  assignment: 'assignment',
  student: 'student',
  originalGrade: 'original-grade',
  currentGrade: 'current-grade',
});

/**
 * <ModalHeaders />
 * Provides a list of HistoryHeaders for the student name, assignment,
 * original grade, and current override grade.
 */
export const ModalHeaders = () => {
  const { assignmentName, updateUserName } = useGradebookUi().modalState;
  const {
    gradeOverrideCurrentEarnedGradedOverride,
    gradeOriginalEarnedGraded,
  } = useGradeOverrideData();
  const { formatMessage } = useIntl();
  return (
    <div>
      <HistoryHeader
        id={HistoryKeys.assignment}
        label={formatMessage(messages.assignmentHeader)}
        value={assignmentName}
      />
      <HistoryHeader
        id={HistoryKeys.student}
        label={formatMessage(messages.studentHeader)}
        value={updateUserName}
      />
      <HistoryHeader
        id={HistoryKeys.originalGrade}
        label={formatMessage(messages.originalGradeHeader)}
        value={gradeOriginalEarnedGraded}
      />
      <HistoryHeader
        id={HistoryKeys.currentGrade}
        label={formatMessage(messages.currentGradeHeader)}
        value={gradeOverrideCurrentEarnedGradedOverride}
      />
    </div>
  );
};

export default ModalHeaders;
