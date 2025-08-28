import React from 'react';

import { initializeMocks, render, screen } from '../../../testUtilsExtra';
import GradebookTable from './index';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('./hooks', () => jest.fn());

const mockUseGradebookTableData = require('./hooks');

const mockHookData = {
  columns: [
    { Header: 'Username', accessor: 'username' },
    { Header: 'Assignment 1', accessor: 'assignment1' },
  ],
  data: [
    { username: 'user1', assignment1: 'A' },
    { username: 'user2', assignment1: 'B' },
  ],
  grades: ['grade1', 'grade2'],
  nullMethod: jest.fn(),
  emptyContent: 'No grades available',
};

describe('GradebookTable', () => {
  beforeEach(() => {
    initializeMocks();
    mockUseGradebookTableData.mockReturnValue(mockHookData);
  });

  it('renders gradebook container', () => {
    render(<GradebookTable />);
    const container = document.querySelector('.gradebook-container');
    expect(container).toBeInTheDocument();
  });

  it('calls useGradebookTableData hook', () => {
    render(<GradebookTable />);
    expect(mockUseGradebookTableData).toHaveBeenCalled();
  });

  it('renders DataTable with data', () => {
    render(<GradebookTable />);

    // Check that the data is rendered in the table
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('renders component without errors when empty', () => {
    mockUseGradebookTableData.mockReturnValue({
      columns: [],
      data: [],
      grades: [],
      nullMethod: jest.fn(),
      emptyContent: 'No grades available',
    });

    render(<GradebookTable />);
    const container = document.querySelector('.gradebook-container');
    expect(container).toBeInTheDocument();
  });
});
