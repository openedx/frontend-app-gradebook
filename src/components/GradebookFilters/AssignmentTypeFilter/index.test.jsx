import React from 'react';
import { screen } from '@testing-library/react';

import useAssignmentFilterTypeData from './hooks';
import AssignmentFilterType from '.';
import { renderWithIntl } from '../../../testUtilsExtra';

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const handleChange = jest.fn();
const testType = 'test-type';
const assignmentTypes = [testType, 'type1', 'type2', 'type3'];
useAssignmentFilterTypeData.mockReturnValue({
  handleChange,
  selectedAssignmentType: testType,
  assignmentTypes,
  isDisabled: true,
});

const updateQueryParams = jest.fn();

describe('AssignmentFilterType component', () => {
  beforeAll(() => {
    renderWithIntl(<AssignmentFilterType updateQueryParams={updateQueryParams} />);
  });
  describe('render', () => {
    test('filter options', () => {
      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(5); // 4 types + "All Types"
      expect(options[1]).toHaveTextContent(testType);
    });
  });
});
