import React from 'react';
import { shallow } from 'enzyme';

import { Form } from '@edx/paragon';

import useAdjustedGradeInputData from './hooks';
import AdjustedGradeInput from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  hintText: 'some-hint-text',
  onChange: jest.fn().mockName('hook.onChange'),
  value: 'test-value',
};
useAdjustedGradeInputData.mockReturnValue(hookProps);

let el;
describe('AdjustedGradeInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<AdjustedGradeInput />);
  });
  describe('behavior', () => {
    it('initializes hook data', () => {
      expect(useAdjustedGradeInputData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
      const control = el.find(Form.Control);
      expect(control.props().value).toEqual(hookProps.value);
      expect(control.props().onChange).toEqual(hookProps.onChange);
      expect(el.contains(hookProps.hintText)).toEqual(true);
    });
  });
});
