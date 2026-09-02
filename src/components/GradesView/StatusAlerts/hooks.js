import { useIntl } from '@edx/frontend-platform/i18n';

import { useGradebookUi } from 'data/gradebookUiContext';
import { useCourseGradeFilterValidity } from 'components/GradebookFilters/data/hooks';

import messages from './messages';

export const useStatusAlertsData = () => {
  const { formatMessage } = useIntl();

  const limitValidity = useCourseGradeFilterValidity();
  const { showSuccess: showSuccessBanner, setShowSuccess } = useGradebookUi();
  const handleCloseSuccessBanner = () => setShowSuccess(false);

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
