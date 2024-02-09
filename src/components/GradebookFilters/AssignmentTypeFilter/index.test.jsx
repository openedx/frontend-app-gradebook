import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { useIntl } from '@edx/frontend-platform/i18n';

import SelectGroup from '../SelectGroup';
import useAssignmentFilterTypeData from './hooks';
import AssignmentFilterType from '.';

jest.mock('../SelectGroup', () => 'SelectGroup');
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

let el;
describe('AssignmentFilterType component', () => {
  beforeAll(() => {
    el = shallow(<AssignmentFilterType updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useAssignmentFilterTypeData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('filter options', () => {
      const { options } = el.instance.findByType(SelectGroup)[0].props;
      expect(options.length).toEqual(5);
      const optionProps = options[1].props;
      expect(optionProps.value).toEqual(assignmentTypes[0]);
      expect(optionProps.children).toEqual(testType);
    });
  });
});
