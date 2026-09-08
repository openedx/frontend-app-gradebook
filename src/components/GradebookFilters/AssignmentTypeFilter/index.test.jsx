import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';
import { useSelectableAssignmentLabels } from '@src/components/GradesView/data/hooks';
import { useFilters } from '@src/data/filtersContext';
import AssignmentTypeFilter from '.';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useCourseIdWithGate: jest.fn(),
  useAssignmentTypes: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useSelectableAssignmentLabels: jest.fn(),
}));
jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));

const assignmentTypes = ['type1', 'type2', 'type3'];
const updateQueryParams = jest.fn();
const setAssignmentType = jest.fn();

const setup = ({
  selectedAssignmentType = '',
  filterOptions = [{ label: 'x' }],
} = {}) => {
  useCourseIdWithGate.mockReturnValue({ courseId: 'test-course', enabled: true });
  useAssignmentTypes.mockReturnValue({ data: { assignmentTypes } });
  useSelectableAssignmentLabels.mockReturnValue(filterOptions);
  useFilters.mockReturnValue({ assignmentType: selectedAssignmentType, setAssignmentType });
  return renderWithAllProviders(<AssignmentTypeFilter updateQueryParams={updateQueryParams} />);
};

describe('AssignmentTypeFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders one option per assignment type plus the "All" default', () => {
    setup();
    // Base "All" (value='') + 3 types.
    expect(screen.getAllByRole('option')).toHaveLength(assignmentTypes.length + 1);
  });

  it('shows the selected assignment type in the select', () => {
    setup({ selectedAssignmentType: 'type2' });
    expect(screen.getByRole('combobox')).toHaveValue('type2');
  });

  it('disables the control when there are no selectable options', () => {
    setup({ filterOptions: [] });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('updates the filter and query params when the selection changes', async () => {
    setup();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'type2');
    expect(setAssignmentType).toHaveBeenCalledWith('type2');
    expect(updateQueryParams).toHaveBeenCalledWith({ assignmentType: 'type2' });
  });
});
