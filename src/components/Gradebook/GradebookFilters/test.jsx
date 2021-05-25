import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';

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
}));

describe('GradebookFilters', () => {
  let props = {
    courseId: '12345',
    filterValues: {
      assignmentGradeMin: '10',
      assignmentGradeMax: '90',
      courseGradeMin: '20',
      courseGradeMax: '80',
    },
    includeCourseRoleMembers: true,
  };

  beforeEach(() => {
    props = {
      ...props,
      updateQueryParams: jest.fn(),
      updateIncludeCourseRoleMembers: jest.fn(),
      setFilters: jest.fn(),
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
    const state = {
      filters: {
        includeCourseRoleMembers: 'plz do',
      },
    };
    describe('includeCourseRoleMembers', () => {
      it('is drawn from filters.includeCourseRoleMembers', () => {
        expect(mapStateToProps(state).includeCourseRoleMembers).toEqual(
          state.filters.includeCourseRoleMembers,
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('updateIncludeCourseRoleMembers', () => {
      expect(mapDispatchToProps.updateIncludeCourseRoleMembers).toEqual(
        actions.filters.update.includeCourseRoleMembers,
      );
    });
  });
});
