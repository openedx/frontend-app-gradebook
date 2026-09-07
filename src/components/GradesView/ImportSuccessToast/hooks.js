import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from 'data/gradebookUiContext';
import { views } from 'data/constants/app';
import messages from './messages';

/**
 * <ImportSuccessToast />
 * Toast component triggered by successful grade upload.
 * Provides a link to view the Bulk Management History tab.
 */
export const useImportSuccessToastData = () => {
  const { formatMessage } = useIntl();

  const { showImportSuccessToast: show, setActiveView, setShowImportSuccessToast } = useGradebookUi();

  const onClose = () => {
    setShowImportSuccessToast(false);
  };

  const handleShowHistoryView = () => {
    setActiveView(views.bulkManagementHistory);
    setShowImportSuccessToast(false);
  };

  return {
    action: {
      label: formatMessage(messages.showHistoryViewBtn),
      onClick: handleShowHistoryView,
    },
    onClose,
    show,
    description: formatMessage(messages.description),
  };
};

export default useImportSuccessToastData;
