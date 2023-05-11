import React from 'react';
import { shallow } from 'enzyme';

import FilterBadges from './FilterBadges';

import useGradesViewData from './hooks';
import GradesView from '.';

jest.mock('./BulkManagementControls', () => 'BulkManagementControls');
jest.mock('./EditModal', () => 'EditModal');
jest.mock('./FilterBadges', () => 'FilterBadges');
jest.mock('./FilteredUsersLabel', () => 'FilteredUsersLabel');
jest.mock('./FilterMenuToggle', () => 'FilterMenuToggle');
jest.mock('./GradebookTable', () => 'GradebookTable');
jest.mock('./ImportSuccessToast', () => 'ImportSuccessToast');
jest.mock('./InterventionsReport', () => 'InterventionsReport');
jest.mock('./PageButtons', () => 'PageButtons');
jest.mock('./ScoreViewInput', () => 'ScoreViewInput');
jest.mock('./SearchControls', () => 'SearchControls');
jest.mock('./SpinnerIcon', () => 'SpinnerIcon');
jest.mock('./StatusAlerts', () => 'StatusAlerts');
jest.mock('./hooks', () => jest.fn());

const hookProps = {
  stepHeadings: {
    filter: 'filter-step-heading',
    gradebook: 'gradebook-step-heading',
  },
  handleFilterBadgeClose: jest.fn().mockName('hooks.handleFilterBadgeClose'),
  mastersHint: 'test-masters-hint',
};
useGradesViewData.mockReturnValue(hookProps);

const updateQueryParams = jest.fn().mockName('props.updateQueryParams');

let el;
describe('GradesView component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<GradesView updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      expect(useGradesViewData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('filterBadges load close behavior from hook', () => {
      expect(el.find(FilterBadges).props().handleClose).toEqual(
        hookProps.handleFilterBadgeClose,
      );
    });
  });
});
