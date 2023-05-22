import React from 'react';
import { shallow } from 'enzyme';

import useImportSuccessToastData from './hooks';
import ImportSuccessToast from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  action: 'test-action',
  onClose: jest.fn().mockName('hooks.onClose'),
  show: 'test-show',
  description: 'test-description',
};
useImportSuccessToastData.mockReturnValue(hookProps);

let el;
describe('ImportSuccessToast component', () => {
  beforeAll(() => {
    el = shallow(<ImportSuccessToast />);
  });
  describe('behavior', () => {
    it('initializes component hook', () => {
      expect(useImportSuccessToastData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('Toast', () => {
      expect(el.type()).toEqual('Toast');
      expect(el.props().action).toEqual(hookProps.action);
      expect(el.props().onClose).toEqual(hookProps.onClose);
      expect(el.props().show).toEqual(hookProps.show);
      expect(el.text()).toEqual(hookProps.description);
    });
  });
});
