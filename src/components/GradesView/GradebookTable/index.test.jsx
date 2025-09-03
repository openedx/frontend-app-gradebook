import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import useGradebookTableData from './hooks';
import GradebookTable from '.';

jest.mock('./hooks', () => jest.fn());

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const hookProps = {
  columns: [{ Header: 'Username', accessor: 'username' }, { Header: 'Email', accessor: 'email' }, { Header: 'Total Grade', accessor: 'totalGrade' }],
  data: [{ username: 'instructor', email: 'instructor@example.com', totalGrade: '100' }, { username: 'student', email: 'student@example.com', totalGrade: '90' }],
  grades: ['a', 'few', 'grades'],
  nullMethod: jest.fn().mockName('hooks.nullMethod'),
  emptyContent: 'empty-table-content',
};

describe('GradebookTable', () => {
  it('renders Datatable correctly', () => {
    useGradebookTableData.mockReturnValue(hookProps);
    render(<IntlProvider locale="en"><GradebookTable /></IntlProvider>);
    expect(useGradebookTableData).toHaveBeenCalled();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent(hookProps.columns[0].Header);
    expect(headers[1]).toHaveTextContent(hookProps.columns[1].Header);
    expect(headers[2]).toHaveTextContent(hookProps.columns[2].Header);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(screen.getByText(hookProps.data[0].username)).toBeInTheDocument();
    expect(screen.getByText(hookProps.data[0].email)).toBeInTheDocument();
    expect(screen.getByText(hookProps.data[0].totalGrade)).toBeInTheDocument();
  });
  it('renders empty table content when no data is available', () => {
    useGradebookTableData.mockReturnValue({
      ...hookProps,
      data: [],
      grades: [],
    });
    render(<IntlProvider locale="en"><GradebookTable /></IntlProvider>);
    expect(screen.getByText(hookProps.emptyContent)).toBeInTheDocument();
  });
});
