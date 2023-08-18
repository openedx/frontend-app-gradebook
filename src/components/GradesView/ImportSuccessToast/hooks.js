import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import { views } from 'data/constants/app';
import messages from './messages';

/**
 * <ImportSuccessToast />
 * Toast component triggered by successful grade upload.
 * Provides a link to view the Bulk Management History tab.
 */
export const useImportSuccessToastData = () => {
  const { formatMessage } = useIntl();

  const show = selectors.app.useShowImportSuccessToast();
  const setAppView = actions.app.useSetView();
  const setShow = actions.app.useSetShowImportSuccessToast();

  const onClose = () => {
    setShow(false);
  };

  const handleShowHistoryView = () => {
    setAppView(views.bulkManagementHistory);
    setShow(false);
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
