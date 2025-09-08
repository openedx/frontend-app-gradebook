import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';

import useAssignmentFilterData from './hooks';
import AssignmentFilter from '.';

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const handleChange = jest.fn();
const selectedAssignmentLabel = 'test-label';
const assignmentFilterOptions = [
  { label: 'label1', subsectionLabel: 'sLabel1' },
  { label: 'label2', subsectionLabel: 'sLabel2' },
  { label: 'label3', subsectionLabel: 'sLabel3' },
  { label: 'label4', subsectionLabel: 'sLabel4' },
];
useAssignmentFilterData.mockReturnValue({
  handleChange,
  selectedAssignmentLabel,
  assignmentFilterOptions,
});

const updateQueryParams = jest.fn();

describe('AssignmentFilter component', () => {
  beforeAll(() => {
    initializeMocks();
    render(<AssignmentFilter updateQueryParams={updateQueryParams} />);
  });
  describe('render', () => {
    test('filter options', () => {
      expect(screen.getByRole('combobox', { name: 'Assignment' })).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(assignmentFilterOptions.length + 1); // +1 for the default option
      expect(screen.getAllByRole('option')[assignmentFilterOptions.length]).toHaveTextContent(assignmentFilterOptions[assignmentFilterOptions.length - 1].label);
    });
  });
});
