/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import useAssignmentGradeFilterData from './hooks';
import AssignmentFilter from '.';

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));
jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const hookData = {
  handleSubmit: jest.fn(),
  handleSetMax: jest.fn(),
  handleSetMin: jest.fn(),
  selectedAssignment: 'test-assignment',
  assignmentGradeMax: 300,
  assignmentGradeMin: 23,
};
useAssignmentGradeFilterData.mockReturnValue(hookData);

const updateQueryParams = jest.fn();

describe('AssignmentFilter component', () => {
  describe('behavior', () => {
    it('initializes hooks', () => {
      render(<IntlProvider locale="en" messages={{}}><AssignmentFilter updateQueryParams={updateQueryParams} /></IntlProvider>);
      expect(useAssignmentGradeFilterData).toHaveBeenCalledWith({ updateQueryParams });
    });
  });
  describe('render', () => {
    describe('with selected assignment', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        render(<IntlProvider locale="en" messages={{}}><AssignmentFilter updateQueryParams={updateQueryParams} /></IntlProvider>);
      });
      it('renders a PercentGroup for both Max and Min filters', async () => {
        const user = userEvent.setup();
        const minGradeInput = screen.getByRole('spinbutton', { name: /Min Grade/i });
        const maxGradeInput = screen.getByRole('spinbutton', { name: /Max Grade/i });
        expect(minGradeInput).toBeInTheDocument();
        expect(maxGradeInput).toBeInTheDocument();
        expect(minGradeInput).toBeEnabled();
        expect(maxGradeInput).toBeEnabled();
        await user.type(minGradeInput, '25');
        expect(hookData.handleSetMin).toHaveBeenCalled();
        await user.type(maxGradeInput, '50');
        expect(hookData.handleSetMax).toHaveBeenCalled();
      });
      it('renders a submit button', async () => {
        const user = userEvent.setup();
        const submitButton = screen.getByRole('button', { name: /Apply/ });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).not.toHaveAttribute('disabled');
        await user.click(submitButton);
        expect(hookData.handleSubmit).toHaveBeenCalled();
      });
    });
    describe('without selected assignment', () => {
      beforeEach(() => {
        useAssignmentGradeFilterData.mockReturnValueOnce({
          ...hookData,
          selectedAssignment: null,
        });
        render(<IntlProvider locale="en" messages={{}}><AssignmentFilter updateQueryParams={updateQueryParams} /></IntlProvider>);
      });
      it('disables controls', () => {
        const minGrade = screen.getByRole('spinbutton', { name: /Min Grade/ });
        const maxGrade = screen.getByRole('spinbutton', { name: /Max Grade/ });
        expect(minGrade).toHaveAttribute('disabled');
        expect(maxGrade).toHaveAttribute('disabled');
      });
    });
  });
});
