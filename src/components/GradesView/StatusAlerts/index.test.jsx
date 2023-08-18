import React from 'react';
import { shallow } from 'enzyme';

import { Alert } from '@edx/paragon';

import useStatusAlertsData from './hooks';
import StatusAlerts from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  successBanner: {
    onClose: jest.fn().mockName('hooks.successBanner.onClose'),
    show: 'hooks.show-success-banner',
    text: 'hooks.success-banner-text',
  },
  gradeFilter: {
    show: 'hooks.show-grade-filter',
    text: 'hooks.grade-filter-text',
  },
};
useStatusAlertsData.mockReturnValue(hookProps);

let el;
describe('StatusAlerts component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<StatusAlerts />);
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      expect(useStatusAlertsData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('success banner', () => {
      const alert = el.find(Alert).at(0);
      const props = alert.props();
      expect(props.onClose).toEqual(hookProps.successBanner.onClose);
      expect(props.show).toEqual(hookProps.successBanner.show);
      expect(alert.text()).toEqual(hookProps.successBanner.text);
    });
    test('grade filter banner', () => {
      const alert = el.find(Alert).at(1);
      const props = alert.props();
      expect(props.show).toEqual(hookProps.gradeFilter.show);
      expect(alert.text()).toEqual(hookProps.gradeFilter.text);
    });
  });
});
