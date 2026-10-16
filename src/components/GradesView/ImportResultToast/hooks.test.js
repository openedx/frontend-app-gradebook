import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';

import useImportResultToastData from './hooks';
import messages from './messages';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  useIntl: () => ({
    formatMessage: (msg, values) => (
      values ? msg.defaultMessage.replace('{details}', values.details) : msg.defaultMessage
    ),
  }),
}));

const DETAILS = 'No grades were changed.';
const SUCCESS = messages.successDescription.defaultMessage;
const FAILURE = `Import failed. ${DETAILS}`;

describe('useImportResultToastData', () => {
  const setActiveView = jest.fn();
  const setShowImportSuccessToast = jest.fn();
  const setShowImportErrorToast = jest.fn();

  const mockUi = ({ success = false, error = false, messages: msgs = [] } = {}) => {
    useGradebookUi.mockReturnValue({
      showImportSuccessToast: success,
      setShowImportSuccessToast,
      showImportErrorToast: error,
      setShowImportErrorToast,
      csvUploadErrorMessages: msgs,
      setActiveView,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUi();
  });

  describe('a successful import', () => {
    it('shows the success message and lets it time out', () => {
      mockUi({ success: true });
      const out = useImportResultToastData();
      expect(out.show).toBe(true);
      expect(out.description).toBe(SUCCESS);
      // Nothing is pinned, so Paragon's own pause-on-hover behaviour stays in effect.
      expect(out.toastProps).toEqual({});
    });
  });

  describe('a failed import', () => {
    it('shows the message the server returned and waits to be dismissed', () => {
      mockUi({ error: true, messages: [DETAILS] });
      const out = useImportResultToastData();
      expect(out.show).toBe(true);
      expect(out.description).toBe(FAILURE);
      // A failure must not disappear on its own; the reader has to act on it.
      expect(out.toastProps).toEqual({ autohide: false });
    });

    it('joins several messages', () => {
      mockUi({ error: true, messages: ['first', 'second'] });
      expect(useImportResultToastData().description).toBe('Import failed. first; second');
    });
  });

  describe('every combination of the state it can see', () => {
    // Exhaustive, because the one outcome never worth risking is claiming success while a
    // failure is flagged -- which is the bug this component exists to prevent.
    const cases = [
      // success, error, messages,   show,  description
      [false, false, [], false, ''],
      [false, false, [DETAILS], false, ''],
      [true, false, [], true, SUCCESS],
      [true, false, [DETAILS], true, SUCCESS],
      [false, true, [], false, ''],
      [false, true, [DETAILS], true, FAILURE],
      [true, true, [], false, ''],
      [true, true, [DETAILS], true, FAILURE],
    ];

    test.each(cases)(
      'success=%p error=%p messages=%p -> show=%p',
      (success, error, msgs, show, description) => {
        mockUi({ success, error, messages: msgs });
        const out = useImportResultToastData();
        expect(out.show).toBe(show);
        expect(out.description).toBe(description);
      },
    );

    it('never claims success while a failure is flagged', () => {
      cases.filter(([, error]) => error).forEach(([success, error, msgs]) => {
        mockUi({ success, error, messages: msgs });
        expect(useImportResultToastData().description).not.toBe(SUCCESS);
      });
    });
  });

  describe('dismissing', () => {
    it('onClose clears both flags', () => {
      useImportResultToastData().onClose();
      expect(setShowImportSuccessToast).toHaveBeenCalledWith(false);
      expect(setShowImportErrorToast).toHaveBeenCalledWith(false);
    });

    it('the action opens the history view and clears both flags', () => {
      useImportResultToastData().action.onClick();
      expect(setActiveView).toHaveBeenCalledWith(views.bulkManagementHistory);
      expect(setShowImportSuccessToast).toHaveBeenCalledWith(false);
      expect(setShowImportErrorToast).toHaveBeenCalledWith(false);
    });

    it('labels the action button', () => {
      expect(useImportResultToastData().action.label)
        .toBe(messages.showHistoryViewBtn.defaultMessage);
    });
  });
});
