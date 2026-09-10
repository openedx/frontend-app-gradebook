import { useIntl } from '@edx/frontend-platform/i18n';

import { views } from 'data/constants/app';
import { actions, selectors } from 'data/redux/hooks';

import useImportResultToastData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: {
      useSetView: jest.fn(),
      useSetShowImportSuccessToast: jest.fn(),
      useSetShowImportErrorToast: jest.fn(),
    },
  },
  selectors: {
    app: {
      useShowImportSuccessToast: jest.fn(),
      useShowImportErrorToast: jest.fn(),
    },
    grades: { useBulkImportErrorMessages: jest.fn() },
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn((context) => context),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: jest.fn(() => ({
    formatMessage: (message, values) => (
      values ? message.defaultMessage.replace('{details}', values.details) : message.defaultMessage
    ),
  })),
}));

const setView = jest.fn().mockName('hooks.setView');
const setShowSuccess = jest.fn().mockName('hooks.setShowImportSuccessToast');
const setShowError = jest.fn().mockName('hooks.setShowImportErrorToast');

const DETAILS = 'No grades were changed.';

/** Put redux in one of the states the hook can see. */
const mockState = ({ success = false, error = false, details = '' } = {}) => {
  actions.app.useSetView.mockReturnValue(setView);
  actions.app.useSetShowImportSuccessToast.mockReturnValue(setShowSuccess);
  actions.app.useSetShowImportErrorToast.mockReturnValue(setShowError);
  selectors.app.useShowImportSuccessToast.mockReturnValue(success);
  selectors.app.useShowImportErrorToast.mockReturnValue(error);
  selectors.grades.useBulkImportErrorMessages.mockReturnValue(details);
};

describe('ImportResultToast hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState();
  });

  it('initializes intl and redux hooks', () => {
    useImportResultToastData();
    expect(useIntl).toHaveBeenCalledWith();
    expect(selectors.app.useShowImportSuccessToast).toHaveBeenCalled();
    expect(selectors.app.useShowImportErrorToast).toHaveBeenCalled();
    expect(selectors.grades.useBulkImportErrorMessages).toHaveBeenCalled();
    expect(actions.app.useSetView).toHaveBeenCalled();
    expect(actions.app.useSetShowImportSuccessToast).toHaveBeenCalled();
    expect(actions.app.useSetShowImportErrorToast).toHaveBeenCalled();
  });

  describe('a successful import', () => {
    it('shows the success message and lets it time out', () => {
      mockState({ success: true });
      const out = useImportResultToastData();
      expect(out.show).toBe(true);
      expect(out.description).toEqual(messages.successDescription.defaultMessage);
      expect(out.autohide).toBe(true);
    });
  });

  describe('a failed import', () => {
    it('shows the message the server returned and waits to be dismissed', () => {
      mockState({ error: true, details: DETAILS });
      const out = useImportResultToastData();
      expect(out.show).toBe(true);
      expect(out.description).toEqual(`Import failed. ${DETAILS}`);
      // A failure must not disappear on its own; the reader has to act on it.
      expect(out.autohide).toBe(false);
    });

    it('takes precedence if a success is somehow flagged too', () => {
      mockState({ success: true, error: true, details: DETAILS });
      expect(useImportResultToastData().description).toEqual(`Import failed. ${DETAILS}`);
    });
  });

  describe('nothing to report', () => {
    it('stays hidden with no message', () => {
      const out = useImportResultToastData();
      expect(out.show).toBe(false);
      expect(out.description).toEqual('');
    });

    it('stays hidden when a failure is flagged with no message to show', () => {
      mockState({ error: true, details: '' });
      expect(useImportResultToastData().show).toBe(false);
    });

    it('never borrows the other outcome\'s wording', () => {
      // Starting another upload clears both flags while the toast is still fading. Neither
      // outcome may inherit the other's message on the way off screen.
      mockState({ error: true, details: DETAILS });
      expect(useImportResultToastData().description).toEqual(`Import failed. ${DETAILS}`);

      mockState();
      const fading = useImportResultToastData();
      expect(fading.show).toBe(false);
      expect(fading.description).toEqual('');
      expect(fading.description).not.toEqual(messages.successDescription.defaultMessage);
    });
  });

  describe('every combination of the state it can see', () => {
    // Exhaustive, because the one outcome never worth risking is claiming success while a
    // failure is flagged -- which is the bug this component exists to prevent.
    const SUCCESS = messages.successDescription.defaultMessage;
    const FAILURE = `Import failed. ${DETAILS}`;
    const cases = [
      // showSuccess, showError, details,  show,  description
      [false, false, '', false, ''],
      [false, false, DETAILS, false, ''],
      [true, false, '', true, SUCCESS],
      [true, false, DETAILS, true, SUCCESS],
      [false, true, '', false, ''],
      [false, true, DETAILS, true, FAILURE],
      [true, true, '', false, ''],
      [true, true, DETAILS, true, FAILURE],
    ];

    test.each(cases)(
      'success=%p error=%p details=%p -> show=%p',
      (success, error, details, show, description) => {
        mockState({ success, error, details });
        const out = useImportResultToastData();
        expect(out.show).toBe(show);
        expect(out.description).toEqual(description);
      },
    );

    it('never claims success while a failure is flagged', () => {
      cases
        .filter(([, error]) => error)
        .forEach(([success, error, details]) => {
          mockState({ success, error, details });
          expect(useImportResultToastData().description).not.toEqual(SUCCESS);
        });
    });
  });

  describe('dismissing', () => {
    it('onClose clears both flags', () => {
      useImportResultToastData().onClose();
      expect(setShowSuccess).toHaveBeenCalledWith(false);
      expect(setShowError).toHaveBeenCalledWith(false);
    });

    it('the action opens the history view and clears both flags', () => {
      useImportResultToastData().action.onClick();
      expect(setView).toHaveBeenCalledWith(views.bulkManagementHistory);
      expect(setShowSuccess).toHaveBeenCalledWith(false);
      expect(setShowError).toHaveBeenCalledWith(false);
    });

    it('labels the action button', () => {
      expect(useImportResultToastData().action.label)
        .toEqual(messages.showHistoryViewBtn.defaultMessage);
    });
  });
});
