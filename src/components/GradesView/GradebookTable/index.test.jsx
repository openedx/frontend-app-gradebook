import React from 'react';
import { shallow } from 'enzyme';

import { DataTable } from '@edx/paragon';

import useGradebookTableData from './hooks';
import GradebookTable from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  columns: ['some', 'columns'],
  data: ['some', 'data'],
  grades: ['a', 'few', 'grades'],
  nullMethod: jest.fn().mockName('hooks.nullMethod'),
  emptyContent: 'empty-table-content',
};
useGradebookTableData.mockReturnValue(hookProps);

let el;
describe('GradebookTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<GradebookTable />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
  test('Datatable props', () => {
    const datatable = el.find(DataTable);
    const props = datatable.props();
    expect(props.columns).toEqual(hookProps.columns);
    expect(props.data).toEqual(hookProps.data);
    expect(props.itemCount).toEqual(hookProps.grades.length);
    expect(props.RowStatusComponent).toEqual(hookProps.nullMethod);
    expect(datatable.children().at(2).type()).toEqual('DataTable.EmptyTable');
    expect(datatable.children().at(2).props().content).toEqual(hookProps.emptyContent);
  });
});
