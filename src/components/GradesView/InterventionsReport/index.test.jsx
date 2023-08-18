import React from 'react';
import { shallow } from 'enzyme';

import { useIntl } from '@edx/frontend-platform/i18n';

import NetworkButton from 'components/NetworkButton';

import messages from './messages';
import useInterventionsReportData from './hooks';
import InterventionsReport from '.';

jest.mock('components/NetworkButton', () => 'NetworkButton');
jest.mock('./hooks', () => jest.fn());

const hookProps = { show: true, handleClick: jest.fn() };
useInterventionsReportData.mockReturnValue(hookProps);

let el;
describe('InterventionsReport component', () => {
  beforeEach(() => {
    el = shallow(<InterventionsReport />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useInterventionsReportData).toHaveBeenCalledWith();
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    it('does now render if show is false', () => {
      useInterventionsReportData.mockReturnValueOnce({ ...hookProps, show: false });
      el = shallow(<InterventionsReport />);
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
      const btnProps = el.find(NetworkButton).props();
      expect(btnProps.label).toEqual(messages.downloadBtn);
      expect(btnProps.onClick).toEqual(hookProps.handleClick);
    });
  });
});
