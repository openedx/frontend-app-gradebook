import React from 'react';
import { shallow } from 'enzyme';

import { DataTable } from '@edx/paragon';

import { formatDateForDisplay } from 'utils';

import AdjustedGradeInput from './AdjustedGradeInput';
import ReasonInput from './ReasonInput';
import useOverrideTableData from './hooks';
import OverrideTable from '.';

jest.mock('utils', () => ({
  formatDateForDisplay: (date) => ({ formatted: date }),
}));
jest.mock('./hooks', () => jest.fn());
jest.mock('./AdjustedGradeInput', () => 'AdjustedGradeInput');
jest.mock('./ReasonInput', () => 'ReasonInput');

const hookProps = {
  hide: false,
  data: [
    { test: 'data' },
    { andOther: 'test-data' },
  ],
  columns: 'test-columns',
};
useOverrideTableData.mockReturnValue(hookProps);

let el;
describe('OverrideTable component', () => {
  beforeEach(() => {
    jest
      .clearAllMocks()
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-01-01').getTime());
    el = shallow(<OverrideTable />);
  });
  describe('behavior', () => {
    it('initializes hook data', () => {
      expect(useOverrideTableData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('null render if hide', () => {
      useOverrideTableData.mockReturnValueOnce({ ...hookProps, hide: true });
      el = shallow(<OverrideTable />);
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
      const table = el.find(DataTable);
      expect(table.props().columns).toEqual(hookProps.columns);
      const data = [...table.props().data];
      const inputRow = data.pop();
      const formattedDate = formatDateForDisplay(new Date());
      expect(data).toEqual(hookProps.data);
      expect(inputRow).toMatchObject({
        adjustedGrade: <AdjustedGradeInput />,
        date: formattedDate,
        reason: <ReasonInput />,
      });
    });
  });
});
