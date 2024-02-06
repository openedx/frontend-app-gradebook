import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { useIntl } from '@edx/frontend-platform/i18n';

import SelectGroup from '../SelectGroup';
import useStudentGroupsFilterData from './hooks';
import StudentGroupsFilter from '.';

jest.mock('../SelectGroup', () => 'SelectGroup');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const props = {
  cohorts: {
    value: 'test-cohort',
    entries: [
      { value: 'v1', name: 'n1' },
      { value: 'v2', name: 'n2' },
      { value: 'v3', name: 'n3' },
    ],
    handleChange: jest.fn(),
    isDisabled: false,
  },
  tracks: {
    value: 'test-track',
    entries: [
      { value: 'v1', name: 'n1' },
      { value: 'v2', name: 'n2' },
      { value: 'v3', name: 'n3' },
      { value: 'v4', name: 'n4' },
    ],
    handleChange: jest.fn(),
  },
};
useStudentGroupsFilterData.mockReturnValue(props);
const updateQueryParams = jest.fn();

let el;
describe('StudentGroupsFilter component', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    el = shallow(<StudentGroupsFilter updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useStudentGroupsFilterData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('track options', () => {
      const {
        options,
        onChange,
        value,
      } = el.instance.findByType(SelectGroup)[0].props;
      expect(value).toEqual(props.tracks.value);
      expect(onChange).toEqual(props.tracks.handleChange);
      expect(options.length).toEqual(5);
      const testEntry = props.tracks.entries[0];
      const optionProps = options[1].props;
      expect(optionProps.value).toEqual(testEntry.value);
      expect(optionProps.children).toEqual(testEntry.name);
    });
    test('cohort options', () => {
      const {
        options,
        onChange,
        disabled,
        value,
      } = el.instance.findByType(SelectGroup)[1].props;
      expect(value).toEqual(props.cohorts.value);
      expect(disabled).toEqual(false);
      expect(onChange).toEqual(props.cohorts.handleChange);
      expect(options.length).toEqual(4);
      const testEntry = props.cohorts.entries[0];
      const optionProps = options[1].props;
      expect(optionProps.value).toEqual(testEntry.value);
      expect(optionProps.children).toEqual(testEntry.name);
    });
  });
});
