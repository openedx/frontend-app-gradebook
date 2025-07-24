import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';

import useAssignmentFilterTypeData from './hooks';
import AssignmentFilterType from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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
    render(<IntlProvider locale="en"><AssignmentFilterType updateQueryParams={updateQueryParams} /></IntlProvider>);
  });
  describe('render', () => {
    test('filter options', () => {
      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(5); // 4 types + "All Types"
      expect(options[1]).toHaveTextContent(testType);
    });
  });
});
