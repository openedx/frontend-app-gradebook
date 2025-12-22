/* eslint-disable import/no-extraneous-dependencies */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useAssignmentGradeFilterData from './hooks';
import AssignmentFilter from '.';
import { renderWithIntl } from '../../../testUtilsExtra';

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const hookData = {
  handleSubmit: jest.fn(),
  handleSetMax: jest.fn(),
  handleSetMin: jest.fn(),
  selectedAssignment: 'test-assignment',
  assignmentGradeMax: 300,
  assignmentGradeMin: 23,
  isDisabled: false,
};
useAssignmentGradeFilterData.mockReturnValue(hookData);

const updateQueryParams = jest.fn();

describe('AssignmentFilter component', () => {
  describe('behavior', () => {
    it('initializes hooks', () => {
      renderWithIntl(<AssignmentFilter updateQueryParams={updateQueryParams} />);
      expect(useAssignmentGradeFilterData).toHaveBeenCalledWith({ updateQueryParams });
    });
  });
  describe('render', () => {
    describe('with selected assignment', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        renderWithIntl(<AssignmentFilter updateQueryParams={updateQueryParams} />);
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
        renderWithIntl(<AssignmentFilter updateQueryParams={updateQueryParams} />);
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
