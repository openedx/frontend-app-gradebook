import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

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
      expect(el.snapshot).toMatchSnapshot();
      const control = el.instance.findByType(Form.Control)[0];
      expect(control.props.value).toEqual(hookProps.value);
      expect(control.props.onChange).toEqual(hookProps.onChange);
    });
  });
});
