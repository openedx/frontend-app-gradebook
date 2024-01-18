import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { getLocale } from '@edx/frontend-platform/i18n';

import { OverlayTrigger } from '@edx/paragon';

import LabelReplacements from './LabelReplacements';

const {
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
  MastersOnlyLabelReplacement,
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
      expect(el.snapshot).toMatchSnapshot();
    });
    test('displays overlay tooltip', () => {
      expect(el.instance.findByType(OverlayTrigger)[0].props.overlay).toMatchSnapshot();
    });
  });
  describe('UsernameLabelReplacement', () => {
    test('snapshot', () => {
      expect(shallow(<UsernameLabelReplacement />).snapshot).toMatchSnapshot();
    });
  });
  describe('MastersOnlyLabelReplacement', () => {
    test('snapshot', () => {
      const message = {
        id: 'id',
        defaultMessage: 'defaultMessAge',
        description: 'desCripTion',
      };
      expect(shallow(<MastersOnlyLabelReplacement {...message} />).snapshot).toMatchSnapshot();
    });
  });
});

describe('snapshot', () => {
  let el;
  test('right to left overlay placement', () => {
    getLocale.mockImplementation(() => 'en');
    el = shallow(<TotalGradeLabelReplacement />);
    expect(el.snapshot).toMatchSnapshot();
  });
  test('left to right overlay placement', () => {
    getLocale.mockImplementation(() => 'ar');
    el = shallow(<TotalGradeLabelReplacement />);
    expect(el.snapshot).toMatchSnapshot();
  });
});
