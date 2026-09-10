import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';

import useImportSuccessToastData from './hooks';
import messages from './messages';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  useIntl: () => ({ formatMessage: (msg) => msg.defaultMessage }),
}));

describe('useImportSuccessToastData', () => {
  const setActiveView = jest.fn();
  const setShowImportSuccessToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useGradebookUi.mockReturnValue({
      showImportSuccessToast: true,
      setActiveView,
      setShowImportSuccessToast,
    });
  });

  it('forwards `showImportSuccessToast` as `show`', () => {
    expect(useImportSuccessToastData().show).toBe(true);
  });

  it('formats the action label and description from messages', () => {
    const out = useImportSuccessToastData();
    expect(out.action.label).toBe(messages.showHistoryViewBtn.defaultMessage);
    expect(out.description).toBe(messages.description.defaultMessage);
  });

  it('action.onClick switches to the bulk-management-history view and hides the toast', () => {
    useImportSuccessToastData().action.onClick();
    expect(setActiveView).toHaveBeenCalledWith(views.bulkManagementHistory);
    expect(setShowImportSuccessToast).toHaveBeenCalledWith(false);
  });

  it('onClose hides the toast', () => {
    useImportSuccessToastData().onClose();
    expect(setShowImportSuccessToast).toHaveBeenCalledWith(false);
  });
});
