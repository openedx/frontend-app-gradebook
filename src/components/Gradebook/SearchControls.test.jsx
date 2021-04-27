import React from 'react';
import { shallow } from 'enzyme';

import { SearchControls } from './SearchControls';

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
      showSpinner: false,
      getUserGrades: jest.fn(),
      searchForUser: jest.fn(),
      setGradebookState: jest.fn(),
      toggleFilterDrawer: jest.fn().mockName('toggleFilterDrawer'),
    };
  });

  const searchControls = (overriddenProps) => {
    props = Object.assign(props, overriddenProps);
    return shallow(<SearchControls {...props} />);
  };

  describe('Component', () => {
    describe('spinner', () => {
      // These tests aren't strictly necessary since they're already covered by snapshot tests
      it('shows a spinner overlay when the page is waiting for some action to complete', () => {
        const wrapper = searchControls({ showSpinner: true });
        expect(wrapper.find('.spinner-overlay').exists()).toEqual(true);
      });

      it('does not show a spinner overlay when page indicates it is not loading', () => {
        const wrapper = searchControls();
        expect(wrapper.find('.spinner-overlay').exists()).toEqual(false);
      });
    });

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
        expect(props.setGradebookState).toHaveBeenCalledWith({ filterValue: 'bob' });
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

    describe('Snapshots', () => {
      test('basic snapshot', () => {
        expect(searchControls()).toMatchSnapshot();
      });

      test('show spinner', () => {
        expect(searchControls({ showSpinner: true })).toMatchSnapshot();
      });
    });
  });
});
