import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { views } from '@src/data/constants/app';
import GradebookPage from '.';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('./GradebookDataLoader', () => () => <div data-testid="gradebook-data-loader" />);
jest.mock('@src/components/WithSidebar', () => ({ children, sidebar }) => (
    <div data-testid="with-sidebar">
      <div data-testid="sidebar">{sidebar}</div>
      <div data-testid="content">{children}</div>
    </div>
  ));
jest.mock('@src/components/GradebookHeader', () => () => <div data-testid="gradebook-header" />);
jest.mock('@src/components/GradesView', () => () => <div data-testid="grades-view" />);
jest.mock('@src/components/GradebookFilters', () => () => <div data-testid="gradebook-filters" />);
jest.mock('@src/components/BulkManagementHistoryView', () => () => <div data-testid="bulk-management-history-view" />);

describe('GradebookPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mounts the data loader, header, sidebar, and filters', () => {
    useGradebookUi.mockReturnValue({ activeView: views.grades });
    renderWithAllProviders(<GradebookPage />);
    expect(screen.getByTestId('gradebook-data-loader')).toBeInTheDocument();
    expect(screen.getByTestId('with-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('gradebook-header')).toBeInTheDocument();
    expect(screen.getByTestId('gradebook-filters')).toBeInTheDocument();
  });

  it('renders GradesView when the active view is grades', () => {
    useGradebookUi.mockReturnValue({ activeView: views.grades });
    renderWithAllProviders(<GradebookPage />);
    expect(screen.getByTestId('grades-view')).toBeInTheDocument();
    expect(screen.queryByTestId('bulk-management-history-view')).not.toBeInTheDocument();
  });

  it('renders BulkManagementHistoryView when the active view is bulk-management-history', () => {
    useGradebookUi.mockReturnValue({ activeView: views.bulkManagementHistory });
    renderWithAllProviders(<GradebookPage />);
    expect(screen.getByTestId('bulk-management-history-view')).toBeInTheDocument();
    expect(screen.queryByTestId('grades-view')).not.toBeInTheDocument();
  });
});
