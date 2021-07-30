import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import {
  GradesTab,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    filters: { resetFilters: jest.fn() },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    grades: { fetchGrades: jest.fn() },
  },
}));

jest.mock('./PageButtons', () => 'PageButtons');
jest.mock('./FilterBadges', () => 'FilterBadges');
jest.mock('./BulkManagementControls', () => 'BulkManagementControls');
jest.mock('./EditModal', () => 'EditModal');
jest.mock('./GradebookTable', () => 'GradebookTable');
jest.mock('./SearchControls', () => 'SearchControls');
jest.mock('./StatusAlerts', () => 'StatusAlerts');
jest.mock('./SpinnerIcon', () => 'SpinnerIcon');
jest.mock('./ScoreViewInput', () => 'ScoreViewInput');
jest.mock('./UsersLabel', () => 'UsersLabel');

describe('GradesTab', () => {
  let props;
  beforeEach(() => {
    props = {
      updateQueryParams: jest.fn(),
      fetchGrades: jest.fn(),
      resetFilters: jest.fn(),
    };
  });

  describe('Component', () => {
    const filterNames = ['duck', 'Duck', 'Duuuuuck', 'GOOOOSE!'];
    describe('behavior', () => {
      let el;
      beforeEach(() => {
        el = shallow(<GradesTab {...props} />);
      });
      describe('handleFilterBadgeClose', () => {
        beforeEach(() => {
          el.instance().handleFilterBadgeClose(filterNames)();
        });
        it('calls props.resetFilters with the filters', () => {
          expect(props.resetFilters).toHaveBeenCalledWith(filterNames);
        });
        it('calls props.updateQueryParams with a reset-filters obj', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            [filterNames[0]]: false,
            [filterNames[1]]: false,
            [filterNames[2]]: false,
            [filterNames[3]]: false,
          });
        });
        it('calls fetchGrades', () => {
          expect(props.fetchGrades).toHaveBeenCalledWith();
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<GradesTab {...props} />);
        el.instance().handleFilterBadgeClose = jest.fn().mockName('this.handleFilterBadgeClose');
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  test('mapStateToProps is empty', () => {
    expect(mapStateToProps({ some: 'state' })).toEqual({});
  });
  describe('mapDispatchToProps', () => {
    describe('fetchGrades', () => {
      test('from thunkActions.grades.fetchGrades', () => {
        expect(mapDispatchToProps.fetchGrades).toEqual(
          thunkActions.grades.fetchGrades,
        );
      });
    });
    describe('resetFilters', () => {
      test('from actions.filters.reset', () => {
        expect(mapDispatchToProps.resetFilters).toEqual(
          actions.filters.reset,
        );
      });
    });
  });
});
