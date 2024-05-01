import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { StrictDict } from 'utils';
import { selectors } from 'data/redux/hooks';

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
  const { assignmentName, updateUserName } = selectors.app.useModalData();
  const { gradeOverrideCurrentEarnedGradedOverride, gradeOriginalEarnedGraded } = selectors.grades.useGradeData();
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
