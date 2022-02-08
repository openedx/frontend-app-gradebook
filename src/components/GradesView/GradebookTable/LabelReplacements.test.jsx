import React from 'react';
import { shallow } from 'enzyme';
import { configure as configureI18n } from '@edx/frontend-platform/i18n';

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

configureI18n({
  config: {
    ENVIRONMENT: 'production',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  loggingService: {
    logError: jest.fn(),
    logInfo: jest.fn(),
  },
  messages: {
    uk: {},
    th: {},
    ru: {},
    'pt-br': {},
    pl: {},
    'ko-kr': {},
    id: {},
    he: {},
    ca: {},
    'zh-cn': {},
    fr: {},
    'es-419': {},
    ar: {},
  },
});

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
