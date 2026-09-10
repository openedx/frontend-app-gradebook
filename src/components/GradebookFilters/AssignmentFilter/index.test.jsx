import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useFilters } from '@src/data/filtersContext';
import {
  useFetchGradesIfAssignmentGradeFiltersSet,
  useSelectableAssignmentLabels,
  useSelectedAssignmentLabel,
} from '@src/components/GradesView/data/hooks';
import AssignmentFilter from '.';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useFetchGradesIfAssignmentGradeFiltersSet: jest.fn(),
  useSelectableAssignmentLabels: jest.fn(),
  useSelectedAssignmentLabel: jest.fn(),
}));

const assignmentFilterOptions = [
  { id: 'id-1', label: 'label1', subsectionLabel: 'sLabel1' },
  { id: 'id-2', label: 'label2', subsectionLabel: 'sLabel2' },
  { id: 'id-3', label: 'label3', subsectionLabel: 'sLabel3' },
];
const updateQueryParams = jest.fn();
const setAssignment = jest.fn();
const conditionalFetch = jest.fn();

const setup = ({
  selectedLabel = 'label2',
  options = assignmentFilterOptions,
} = {}) => {
  useFilters.mockReturnValue({ setAssignment });
  useSelectableAssignmentLabels.mockReturnValue(options);
  useSelectedAssignmentLabel.mockReturnValue(selectedLabel);
  useFetchGradesIfAssignmentGradeFiltersSet.mockReturnValue(conditionalFetch);
  return renderWithAllProviders(<AssignmentFilter updateQueryParams={updateQueryParams} />);
};

describe('AssignmentFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders one option per assignment plus the "All" default', () => {
    setup();
    expect(screen.getAllByRole('option')).toHaveLength(assignmentFilterOptions.length + 1);
  });

  it('shows the selected assignment label in the select', () => {
    setup({ selectedLabel: 'label2' });
    expect(screen.getByRole('combobox')).toHaveValue('label2');
  });

  it('disables the control when there are no options', () => {
    setup({ options: [] });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('updates the filter, query params, and triggers a conditional refetch on change', async () => {
    setup();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'label3');
    expect(setAssignment).toHaveBeenCalledWith('id-3');
    expect(updateQueryParams).toHaveBeenCalledWith({ assignment: 'id-3' });
    expect(conditionalFetch).toHaveBeenCalled();
  });

  it('clears the filter when the "All" option is picked', async () => {
    setup();
    await userEvent.selectOptions(screen.getByRole('combobox'), '');
    expect(setAssignment).toHaveBeenCalledWith('');
  });
});
