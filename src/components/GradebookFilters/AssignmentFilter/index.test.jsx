import React from 'react';
import { shallow } from 'enzyme';
import { useIntl } from '@edx/frontend-platform/i18n';

import SelectGroup from '../SelectGroup';
import useAssignmentFilterData from './hooks';
import AssignmentFilter from '.';

jest.mock('../SelectGroup', () => 'SelectGroup');
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

let el;
describe('AssignmentFilter component', () => {
  beforeAll(() => {
    el = shallow(<AssignmentFilter updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useAssignmentFilterData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('filter options', () => {
      const { options } = el.find(SelectGroup).props();
      expect(options.length).toEqual(5);
      const testOption = assignmentFilterOptions[0];
      const optionProps = options[1].props;
      expect(optionProps.value).toEqual(testOption.label);
      expect(optionProps.children.join(''))
        .toEqual(`${testOption.label}: ${testOption.subsectionLabel}`);
    });
  });
});
