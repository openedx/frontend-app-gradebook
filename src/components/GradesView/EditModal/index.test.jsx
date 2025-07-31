import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import useEditModalData from './hooks';
import EditModal from '.';
import messages from './messages';

jest.mock('./hooks', () => jest.fn());
jest.mock('./ModalHeaders', () => jest.fn(() => <div>ModalHeaders</div>));
jest.mock('./OverrideTable', () => jest.fn(() => <div>OverrideTable</div>));

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const hookProps = {
  onClose: jest.fn().mockName('hooks.onClose'),
  error: 'test-error',
  handleAdjustedGradeClick: jest.fn().mockName('hooks.handleAdjustedGradeClick'),
  isOpen: true,
};

describe('EditModal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      useEditModalData.mockReturnValue(hookProps);
      render(<IntlProvider locale="en"><EditModal /></IntlProvider>);
      expect(useEditModalData).toHaveBeenCalled();
    });
  });
  describe('renders', () => {
    const testModal = () => {
      it('modal properly', () => {
        const modal = screen.getByRole('dialog', { title: messages.title.defaultMessage });
        expect(modal).toBeInTheDocument();
      });
      it('triggers onClose when closed', async () => {
        const user = userEvent.setup();
        const closeButton = screen.getByRole('button', { name: messages.closeText.defaultMessage });
        await user.click(closeButton);
        expect(hookProps.onClose).toHaveBeenCalled();
      });
    };
    const testBody = () => {
      it('headers row', () => {
        const headers = screen.getByText('ModalHeaders');
        expect(headers).toBeInTheDocument();
      });
      it('table row', () => {
        const table = screen.getByText('OverrideTable');
        expect(table).toBeInTheDocument();
      });
      it('messages', () => {
        const visibilityMessage = screen.getByText(messages.visibility.defaultMessage);
        const saveVisibilityMessage = screen.getByText(messages.saveVisibility.defaultMessage);
        expect(visibilityMessage).toBeInTheDocument();
        expect(saveVisibilityMessage).toBeInTheDocument();
      });
    };
    const testFooter = () => {
      it('adjusted grade button', async () => {
        const user = userEvent.setup();
        const saveGradeButton = screen.getByRole('button', { name: messages.saveGrade.defaultMessage });
        expect(saveGradeButton).toBeInTheDocument();
        await user.click(saveGradeButton);
        expect(hookProps.handleAdjustedGradeClick).toHaveBeenCalled();
      });
      it('close button', async () => {
        const user = userEvent.setup();
        const cancelButton = screen.getByRole('button', { name: messages.closeText.defaultMessage });
        expect(cancelButton).toBeInTheDocument();
        await user.click(cancelButton);
        expect(hookProps.onClose).toHaveBeenCalled();
      });
    };
    describe('without error', () => {
      beforeEach(() => {
        useEditModalData.mockReturnValueOnce({ ...hookProps, error: undefined });
        render(<IntlProvider locale="en"><EditModal /></IntlProvider>);
      });
      testModal();
      testBody();
      testFooter();
      test('alert row', () => {
        screen.debug();
        const alert = screen.queryByRole('alert');
        expect(alert).toBeNull();
      });
    });
    describe('with error', () => {
      beforeEach(() => {
        useEditModalData.mockReturnValue(hookProps);
        render(<IntlProvider locale="en"><EditModal /></IntlProvider>);
      });
      testModal();
      testBody();
      test('alert row', () => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(hookProps.error);
      });
      testFooter();
    });
  });
});
