import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades } from './data/hooks';
import GradesView from '.';
import messages from './messages';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('./data/hooks', () => ({
  ...jest.requireActual('./data/hooks'),
  useRefetchGrades: jest.fn(),
}));

// Mock the entire child component tree so the parent test focuses on layout.
jest.mock('./BulkManagementControls', () => () => <div data-testid="bulk-management-controls" />);
jest.mock('./EditModal', () => () => <div data-testid="edit-modal" />);
jest.mock('./FilterBadges', () => () => <div data-testid="filter-badges" />);
jest.mock('./FilteredUsersLabel', () => () => <div data-testid="filtered-users-label" />);
jest.mock('./FilterMenuToggle', () => () => <div data-testid="filter-menu-toggle" />);
jest.mock('./GradebookTable', () => () => <div data-testid="gradebook-table" />);
jest.mock('./ImportSuccessToast', () => () => <div data-testid="import-success-toast" />);
jest.mock('./InterventionsReport', () => () => <div data-testid="interventions-report" />);
jest.mock('./PageButtons', () => () => <div data-testid="page-buttons" />);
jest.mock('./ScoreViewInput', () => () => <div data-testid="score-view-input" />);
jest.mock('./SearchControls', () => () => <div data-testid="search-controls" />);
jest.mock('./SpinnerIcon', () => () => <div data-testid="spinner-icon" />);
jest.mock('./StatusAlerts', () => () => <div data-testid="status-alerts" />);

describe('GradesView', () => {
  const resetFilters = jest.fn();
  const updateQueryParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFilters.mockReturnValue({ resetFilters });
    useRefetchGrades.mockReturnValue(jest.fn());
  });

  it('renders the two step headings and the master hint', () => {
    renderWithAllProviders(<GradesView updateQueryParams={updateQueryParams} />);
    expect(screen.getByText(messages.filterStepHeading.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.gradebookStepHeading.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(messages.mastersHint.defaultMessage))).toBeInTheDocument();
  });

  it('mounts the main sub-components', () => {
    renderWithAllProviders(<GradesView updateQueryParams={updateQueryParams} />);
    ['filter-badges', 'status-alerts', 'gradebook-table', 'page-buttons', 'edit-modal'].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });
});
