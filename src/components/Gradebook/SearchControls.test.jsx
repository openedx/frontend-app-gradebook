import React from 'react';
import { shallow } from 'enzyme';

import {
  fetchGrades,
  fetchMatchingUserGrades,
} from '../../data/actions/grades';
import { mapDispatchToProps, mapStateToProps, SearchControls } from './SearchControls';

jest.mock('@edx/paragon', () => ({
  Icon: 'Icon',
  Button: 'Button',
  SearchField: 'SearchField',
}));

describe('SearchControls', () => {
  let props;

  beforeEach(() => {
    jest.resetAllMocks();
    props = {
      courseId: 'course-v1:edX+DEV101+T1',
      filterValue: 'alice',
      selectedAssignmentType: 'homework',
      selectedCohort: 'spring term',
      selectedTrack: 'masters',
      getUserGrades: jest.fn(),
      searchForUser: jest.fn(),
      setFilterValue: jest.fn(),
      toggleFilterDrawer: jest.fn().mockName('toggleFilterDrawer'),
    };
  });

  const searchControls = (overriddenProps) => {
    props = { ...props, ...overriddenProps };
    return shallow(<SearchControls {...props} />);
  };

  describe('Component', () => {
    describe('onSubmit', () => {
      it('calls props.searchForUser with correct data', () => {
        const wrapper = searchControls();
        wrapper.instance().onSubmit('bob');

        expect(props.searchForUser).toHaveBeenCalledWith(
          props.courseId,
          'bob',
          props.selectedCohort,
          props.selectedTrack,
          props.selectedAssignmentType,
        );
      });
    });

    describe('onChange', () => {
      it('saves the changed search value to Gradebook state', () => {
        const wrapper = searchControls();
        wrapper.instance().onChange('bob');
        expect(props.setFilterValue).toHaveBeenCalledWith('bob');
      });
    });

    describe('onClear', () => {
      it('re-runs search with existing filters', () => {
        const wrapper = searchControls();
        wrapper.instance().onClear();
        expect(props.getUserGrades).toHaveBeenCalledWith(
          props.courseId,
          props.selectedCohort,
          props.selectedTrack,
          props.selectedAssignmentType,
        );
      });
    });

    describe('mapStateToProps', () => {
      const state = {
        filters: {
          assignmentType: 'labs',
          track: 'honor',
          cohort: 'fall term',
        },
      };

      it('is maps assignment type filter correctly', () => {
        expect(mapStateToProps(state).selectedAssignmentType).toEqual(state.filters.assignmentType);
      });

      it('is maps track filter correctly', () => {
        expect(mapStateToProps(state).selectedTrack).toEqual(state.filters.track);
      });

      it('is maps cohort filter correctly', () => {
        expect(mapStateToProps(state).selectedCohort).toEqual(state.filters.cohort);
      });
    });

    describe('mapDispatchToProps', () => {
      test('getUserGrades', () => {
        expect(mapDispatchToProps.getUserGrades).toEqual(fetchGrades);
      });

      test('searchForUser', () => {
        expect(mapDispatchToProps.searchForUser).toEqual(fetchMatchingUserGrades);
      });
    });

    describe('Snapshots', () => {
      test('basic snapshot', () => {
        const wrapper = searchControls();
        wrapper.instance().onChange = jest.fn().mockName('onChange');
        wrapper.instance().onClear = jest.fn().mockName('onClear');
        wrapper.instance().onSubmit = jest.fn().mockName('onSubmit');
        expect(wrapper.instance().render()).toMatchSnapshot();
      });
    });
  });
});
