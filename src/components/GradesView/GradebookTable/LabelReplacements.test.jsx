import React from 'react';
import { shallow } from 'enzyme';

import { OverlayTrigger } from '@edx/paragon';

import LabelReplacements from './LabelReplacements';

const {
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
} = LabelReplacements;

jest.mock('@edx/paragon', () => ({
  Icon: () => 'Icon',
  OverlayTrigger: () => 'OverlayTrigger',
  Tooltip: () => 'Tooltip',
}));

describe('LabelReplacements', () => {
  describe('TotalGradeLabelReplacement', () => {
    let el;
    beforeEach(() => {
      el = shallow(<TotalGradeLabelReplacement />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('displays overlay tooltip', () => {
      expect(el.find(OverlayTrigger).props().overlay).toMatchSnapshot();
    });
  });
  describe('UsernameLabelReplacement', () => {
    test('snapshot', () => {
      expect(shallow(<UsernameLabelReplacement />)).toMatchSnapshot();
    });
  });
});
