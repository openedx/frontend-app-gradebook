import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import { views } from 'data/constants/app';
import messages from './messages';

/**
 * <ImportResultToast />
 * Reports the outcome of a grade upload, whether it succeeded or failed, and links to the
 * Bulk Management History tab.
 */
export const useImportResultToastData = () => {
  const { formatMessage } = useIntl();

  const showSuccess = selectors.app.useShowImportSuccessToast();
  const showError = selectors.app.useShowImportErrorToast();
  const details = selectors.grades.useBulkImportErrorMessages();
  const setAppView = actions.app.useSetView();
  const setShowSuccess = actions.app.useSetShowImportSuccessToast();
  const setShowError = actions.app.useSetShowImportErrorToast();

  // A failure needs its message to say anything useful, so it is only reportable once both
  // are present. A flagged failure suppresses the success claim either way: with no message
  // there is nothing to show, but reporting success alongside a known failure is the one
  // outcome never worth risking.
  const isError = !!showError && !!details;
  const isSuccess = !showError && !!showSuccess;

  // Each outcome requires its own flag, so neither can borrow the other's wording. Starting
  // a second upload clears both while this toast is still fading, and an empty string is
  // the right thing to render for the instant it takes to leave the screen.
  let description = '';
  if (isError) {
    description = formatMessage(messages.errorDescription, { details });
  } else if (isSuccess) {
    description = formatMessage(messages.successDescription);
  }

  const hide = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return {
    action: {
      label: formatMessage(messages.showHistoryViewBtn),
      onClick: () => {
        setAppView(views.bulkManagementHistory);
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
