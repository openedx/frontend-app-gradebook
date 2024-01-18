import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

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
      expect(el.snapshot).toMatchSnapshot();
    });
    test('Toast', () => {
      expect(el.instance.type).toEqual('Toast');
      expect(el.instance.props.action).toEqual(hookProps.action);
      expect(el.instance.props.onClose).toEqual(hookProps.onClose);
      expect(el.instance.props.show).toEqual(hookProps.show);
      expect(el.instance.children[0].el).toEqual(hookProps.description);
    });
  });
});
