import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { views } from 'data/constants/app';
import { actions, selectors } from 'data/redux/hooks';

import useImportSuccessToastData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: {
      useSetView: jest.fn(),
      useSetShowImportSuccessToast: jest.fn(),
    },
  },
  selectors: {
    app: { useShowImportSuccessToast: jest.fn() },
  },
}));

const setView = jest.fn().mockName('hooks.setView');
const setShowToast = jest.fn().mockName('hooks.setShowImportSuccessToast');
actions.app.useSetView.mockReturnValue(setView);
actions.app.useSetShowImportSuccessToast.mockReturnValue(setShowToast);
const showImportSuccessToast = 'test-show-import-success-toast';
selectors.app.useShowImportSuccessToast.mockReturnValue(showImportSuccessToast);

let out;
describe('ImportSuccessToast component', () => {
  beforeAll(() => {
    out = useImportSuccessToastData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalledWith();
    });
    it('initializes redux hooks', () => {
      expect(selectors.app.useShowImportSuccessToast).toHaveBeenCalled();
      expect(actions.app.useSetView).toHaveBeenCalled();
      expect(actions.app.useSetShowImportSuccessToast).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    test('action label', () => {
      expect(out.action.label).toEqual(formatMessage(messages.showHistoryViewBtn));
    });
    test('action click event', () => {
      out.action.onClick();
      expect(setView).toHaveBeenCalledWith(views.bulkManagementHistory);
      expect(setShowToast).toHaveBeenCalledWith(false);
    });
    test('onClose', () => {
      out.onClose();
      expect(setShowToast).toHaveBeenCalledWith(false);
    });
  });
});
