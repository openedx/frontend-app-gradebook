import React from 'react';
import { shallow } from 'enzyme';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { formatMessage } from 'testUtils';
import { instructorDashboardUrl } from 'data/services/lms/urls';

import useGradebookHeaderData from './hooks';
import GradebookHeader from '.';

jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('data/services/lms/urls', () => ({
  instructorDashboardUrl: jest.fn(),
}));

instructorDashboardUrl.mockReturnValue('test-dashboard-url');

const hookProps = {
  areGradesFrozen: false,
  canUserViewGradebook: true,
  courseId: 'test-course-id',
  handleToggleViewClick: jest.fn().mockName('hooks.handleToggleViewClick'),
  showBulkManagement: false,
  toggleViewMessage: { defaultMessage: 'toggle-view-message' },
};
useGradebookHeaderData.mockReturnValue(hookProps);

let el;
describe('GradebookHeader component', () => {
  beforeAll(() => {
    el = shallow(<GradebookHeader />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useGradebookHeaderData).toHaveBeenCalledWith();
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    describe('default view', () => {
      test('shapshot', () => {
        expect(el).toMatchSnapshot();
      });
    });
    describe('show bulk management', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValueOnce({ ...hookProps, showBulkManagement: true });
        el = shallow(<GradebookHeader />);
      });
      test('snapshot: show toggle view message button with handleToggleViewClick method', () => {
        expect(el).toMatchSnapshot();
        const { onClick, children } = el.find(Button).props();
        expect(onClick).toEqual(hookProps.handleToggleViewClick);
        expect(children).toEqual(formatMessage(hookProps.toggleViewMessage));
      });
    });
    describe('frozen grades', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValueOnce({ ...hookProps, areGradesFrozen: true });
        el = shallow(<GradebookHeader />);
      });
      test('snapshot: show frozen warning', () => {
        expect(el).toMatchSnapshot();
      });
    });
    describe('user cannot view gradebook', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValueOnce({ ...hookProps, canUserViewGradebook: false });
        el = shallow(<GradebookHeader />);
      });
      test('snapshot: show unauthorized warning', () => {
        expect(el).toMatchSnapshot();
      });
    });
  });
});
