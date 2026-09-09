import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders, initializeMocks } from '@src/testUtils';
import { useFilters } from '@src/data/filtersContext';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useRefetchGrades } from '@src/components/GradesView/data/hooks';

import GradebookFilters from '.';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useRefetchGrades: jest.fn(),
}));

initializeMocks();

describe('GradebookFilters', () => {
  const updateQueryParams = jest.fn();
  const setIncludeCourseRoleMembers = jest.fn();
  const closeFilterMenu = jest.fn();
  const fetchGrades = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFilters.mockReturnValue({
      includeCourseRoleMembers: false,
      setIncludeCourseRoleMembers,
    });
    useGradebookUi.mockReturnValue({ closeFilterMenu });
    useRefetchGrades.mockReturnValue(fetchGrades);
  });

  describe('All filters render together', () => {
    beforeEach(() => {
      renderWithAllProviders(<GradebookFilters updateQueryParams={updateQueryParams} />);
    });
    test('Assignment filters', () => {
      expect(screen.getByRole('combobox', { name: 'Assignment Types' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Assignment' })).toBeInTheDocument();
    });
    test('CourseGrade filters', () => {
      expect(screen.getByRole('button', { name: 'Overall Grade' })).toBeInTheDocument();
    });
    test('StudentGroups filters', () => {
      expect(screen.getByRole('button', { name: 'Student Groups' })).toBeInTheDocument();
    });
    test('includeCourseTeamMembers', () => {
      expect(screen.getByRole('button', { name: 'Include Course Team Members' })).toBeInTheDocument();
    });
  });

  it('close-filters icon button invokes closeFilterMenu', async () => {
    const user = userEvent.setup();
    renderWithAllProviders(<GradebookFilters updateQueryParams={updateQueryParams} />);
    await user.click(screen.getByRole('button', { name: 'Close Filters' }));
    expect(closeFilterMenu).toHaveBeenCalledTimes(1);
  });

  it('toggling the "include course team members" checkbox updates state, params, and refetches', async () => {
    const user = userEvent.setup();
    renderWithAllProviders(<GradebookFilters updateQueryParams={updateQueryParams} />);
    await user.click(screen.getByRole('checkbox', { name: 'Include Course Team Members' }));
    expect(setIncludeCourseRoleMembers).toHaveBeenCalledWith(true);
    expect(fetchGrades).toHaveBeenCalledTimes(1);
    expect(updateQueryParams).toHaveBeenCalledWith({ includeCourseRoleMembers: true });
  });
});
