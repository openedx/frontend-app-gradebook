import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';
import messages from './messages';

/**
 * <ImportResultToast />
 * Reports the outcome of a grade upload, whether it succeeded or failed, and links to the
 * Bulk Management History tab.
 */
export const useImportResultToastData = () => {
  const { formatMessage } = useIntl();

  const {
    showImportSuccessToast,
    setShowImportSuccessToast,
    showImportErrorToast,
    setShowImportErrorToast,
    csvUploadErrorMessages,
    setActiveView,
  } = useGradebookUi();

  const details = csvUploadErrorMessages.join('; ');

  // A failure needs its message to say anything useful, so it is only reportable once both
  // are present. A flagged failure suppresses the success claim either way: with no message
  // there is nothing to show, but reporting success alongside a known failure is the one
  // outcome never worth risking.
  const isError = !!showImportErrorToast && !!details;
  const isSuccess = !showImportErrorToast && !!showImportSuccessToast;

  // Each outcome requires its own flag, so neither can borrow the other's wording.
  let description = '';
  if (isError) {
    description = formatMessage(messages.errorDescription, { details });
  } else if (isSuccess) {
    description = formatMessage(messages.successDescription);
  }

  const hide = () => {
    setShowImportSuccessToast(false);
    setShowImportErrorToast(false);
  };

  return {
    action: {
      label: formatMessage(messages.showHistoryViewBtn),
      onClick: () => {
        setActiveView(views.bulkManagementHistory);
        hide();
      },
    },
    onClose: hide,
    show: isError || isSuccess,
    // Paragon defaults its Toast to auto-dismissing, and spreads extra props after that,
    // so this reaches react-bootstrap. A failure waits to be dismissed; a success asks
    // nothing of the reader and can time out as usual.
    autohide: !isError,
    description,
  };
};

export default useImportResultToastData;
