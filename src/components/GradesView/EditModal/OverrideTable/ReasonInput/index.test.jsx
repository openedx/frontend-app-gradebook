import React from 'react';
import { shallow } from 'enzyme';

import { Form } from '@edx/paragon';

import useReasonInputData from './hooks';
import ReasonInput from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  ref: 'reason-input-ref',
  onChange: jest.fn().mockName('hook.onChange'),
  value: 'test-value',
};
useReasonInputData.mockReturnValue(hookProps);

let el;
describe('ReasonInput component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<ReasonInput />);
  });
  describe('behavior', () => {
    it('initializes hook data', () => {
      expect(useReasonInputData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
      const control = el.find(Form.Control);
      expect(control.props().value).toEqual(hookProps.value);
      expect(control.props().onChange).toEqual(hookProps.onChange);
    });
  });
});
