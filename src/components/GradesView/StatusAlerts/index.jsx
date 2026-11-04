import { Alert } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import {
  useAssignmentGradeFilterValidity,
  useCourseGradeFilterValidity,
} from '@src/components/GradebookFilters/data/hooks';
import { useSelectedAssignmentLabel } from '@src/components/GradesView/data/hooks';

import messages from './messages';

export const StatusAlerts = () => {
  const { formatMessage } = useIntl();
  const assignmentValidity = useAssignmentGradeFilterValidity();
  const courseValidity = useCourseGradeFilterValidity();
  const selectedAssignment = useSelectedAssignmentLabel();
  const { showSuccess, setShowSuccess } = useGradebookUi();

  const gradeFilterMessages = [
    ...(selectedAssignment ? [
      [assignmentValidity.isMinValid, messages.minAssignmentGradeInvalid],
      [assignmentValidity.isMaxValid, messages.maxAssignmentGradeInvalid],
      [assignmentValidity.isRangeValid, messages.assignmentGradeRangeInvalid],
    ] : []),
    [courseValidity.isMinValid, messages.minGradeInvalid],
    [courseValidity.isMaxValid, messages.maxGradeInvalid],
    [courseValidity.isRangeValid, messages.courseGradeRangeInvalid],
  ].filter(([isValid]) => !isValid).map(([, message]) => formatMessage(message));

  return (
    <>
      <Alert
        variant="success"
        onClose={() => setShowSuccess(false)}
        show={showSuccess}
      >
        {formatMessage(messages.editSuccessAlert)}
      </Alert>
      <Alert
        variant="danger"
        dismissible={false}
        show={gradeFilterMessages.length > 0}
      >
        {gradeFilterMessages.map((message) => <div key={message}>{message}</div>)}
      </Alert>
    </>
  );
};

StatusAlerts.propTypes = {};

export default StatusAlerts;
