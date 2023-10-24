import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import messages from './messages';

export const useStatusAlertsData = () => {
  const { formatMessage } = useIntl();

  const courseLimitValidity = selectors.app.useCourseGradeFilterValidity();
  const assignmentLimitValidity = selectors.app.useAssignmentGradeFilterValidity();

  const showSuccessBanner = selectors.grades.useShowSuccess();
  const handleCloseSuccessBanner = actions.grades.useCloseBanner();

  const isCourseGradeFilterAlertOpen = !courseLimitValidity.isMinValid
    || !courseLimitValidity.isMaxValid || !courseLimitValidity.isMinLessMaxValid;
  const isAssignmentGradeFilterAlertOpen = !assignmentLimitValidity.isMinValid
    || !assignmentLimitValidity.isMaxValid || !assignmentLimitValidity.isMinLessMaxValid;

  const courseValidityMessages = {
    min: courseLimitValidity.isMinValid ? '' : formatMessage(messages.minGradeInvalid),
    max: courseLimitValidity.isMaxValid ? '' : formatMessage(messages.maxGradeInvalid),
    minLessMax: courseLimitValidity.isMinLessMaxValid ? '' : formatMessage(messages.minLessMaxGradeInvalid),
  };

  const assignmentValidityMessages = {
    min: assignmentLimitValidity.isMinValid ? '' : formatMessage(messages.minAssignmentInvalid),
    max: assignmentLimitValidity.isMaxValid ? '' : formatMessage(messages.maxAssignmentInvalid),
    minLessMax: assignmentLimitValidity.isMinLessMaxValid ? '' : formatMessage(messages.minLessMaxAssignmentInvalid),
  };

  return {
    successBanner: {
      onClose: handleCloseSuccessBanner,
      show: showSuccessBanner,
      text: formatMessage(messages.editSuccessAlert),
    },
    courseGradeFilter: {
      show: isCourseGradeFilterAlertOpen,
      text: `${courseValidityMessages.min} ${courseValidityMessages.max} ${courseValidityMessages.minLessMax}`,
    },
    assignmentGradeFilter: {
      show: isAssignmentGradeFilterAlertOpen,
      text: `${assignmentValidityMessages.min} ${assignmentValidityMessages.max} ${assignmentValidityMessages.minLessMax}`,
    },
  };
};
export default useStatusAlertsData;
