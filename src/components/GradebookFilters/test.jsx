import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import {
  GradebookFilters,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('@edx/paragon', () => ({
  Collapsible: 'Collapsible',
  Form: {
    Checkbox: 'Checkbox',
  },
  Icon: 'Icon',
  IconButton: 'IconButton',
}));
jest.mock('@edx/paragon/icons', () => ({
  Close: 'paragon.icons.Close',
}));
jest.mock('./AssignmentTypeFilter', () => 'AssignmentTypeFilter');
jest.mock('./AssignmentFilter', () => 'AssignmentFilter');
jest.mock('./AssignmentGradeFilter', () => 'AssignmentGradeFilter');
jest.mock('./CourseGradeFilter', () => 'CourseGradeFilter');
jest.mock('./StudentGroupsFilter', () => 'StudentGroupsFilter');
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    filters: {
      includeCourseRoleMembers: jest.fn((state) => ({ includeCourseRoleMembers: state })),
    },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    app: { filterMenu: { close: jest.fn() } },
    grades: { fetchGrades: jest.fn() },
  },
}));

describe('GradebookFilters', () => {
  let props = {
    includeCourseRoleMembers: true,
  };

  beforeEach(() => {
    props = {
      ...props,
      intl: { formatMessage: (msg) => msg.defaultMessage },
      closeMenu: jest.fn().mockName('this.props.closeMenu'),
      fetchGrades: jest.fn(),
      updateIncludeCourseRoleMembers: jest.fn(),
      updateQueryParams: jest.fn().mockName('this.props.updateQueryParams'),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      describe('handleIncludeTeamMembersChange', () => {
        let el;
        beforeEach(() => {
          el = shallow(<GradebookFilters {...props} />);
          el.instance().setState = jest.fn();
        });
        it('calls setState with newVal', () => {
          el.instance().handleIncludeTeamMembersChange(
            { target: { checked: true } },
          );
          expect(
            el.instance().setState,
          ).toHaveBeenCalledWith({ includeCourseRoleMembers: true });
        });
        it('calls props.updateIncludeCourseRoleMembers with newVal', () => {
          el.instance().handleIncludeTeamMembersChange(
            { target: { checked: false } },
          );
          expect(
            props.updateIncludeCourseRoleMembers,
          ).toHaveBeenCalledWith(false);
        });
        it('calls props.updateQueryParams with newVal', () => {
          el.instance().handleIncludeTeamMembersChange(
            { target: { checked: true } },
          );
          expect(
            props.updateQueryParams,
          ).toHaveBeenCalledWith({ includeCourseRoleMembers: true });
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<GradebookFilters {...props} />);
        el.instance().handleIncludeTeamMembersChange = jest.fn().mockName(
          'handleIncludeTeamMembersChange',
        );
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'laska' };
    test('includeCourseRoleMembers from filters.includeCourseRoleMembers', () => {
      expect(
        mapStateToProps(testState).includeCourseRoleMembers,
      ).toEqual(selectors.filters.includeCourseRoleMembers(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('fetchGrades from thunkActions.grades.fetchGrades', () => {
      expect(mapDispatchToProps.fetchGrades).toEqual(thunkActions.grades.fetchGrades);
    });
    describe('updateIncludeCourseRoleMembers', () => {
      test('from actions.filters.update.includeCourseRoleMembers', () => {
        expect(mapDispatchToProps.updateIncludeCourseRoleMembers).toEqual(
          actions.filters.update.includeCourseRoleMembers,
        );
      });
    });
  });
});
