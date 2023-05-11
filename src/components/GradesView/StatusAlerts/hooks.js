import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import messages from './messages';

export const useStatusAlertsData = () => {
  const { formatMessage } = useIntl();

  const limitValidity = selectors.app.useCourseGradeFilterValidity();
  const showSuccessBanner = selectors.grades.useShowSuccess();
  const handleCloseSuccessBanner = actions.grades.useCloseBanner();

  const isCourseGradeFilterAlertOpen = !limitValidity.isMinValid || !limitValidity.isMaxValid;

  const validityMessages = {
    min: limitValidity.isMinValid ? '' : formatMessage(messages.minGradeInvalid),
    max: limitValidity.isMaxValid ? '' : formatMessage(messages.maxGradeInvalid),
  };

  return {
    successBanner: {
      onClose: handleCloseSuccessBanner,
      show: showSuccessBanner,
      text: formatMessage(messages.editSuccessAlert),
    },
    gradeFilter: {
      show: isCourseGradeFilterAlertOpen,
      text: `${validityMessages.min}${validityMessages.max}`,
    },
  };
};
export default useStatusAlertsData;
