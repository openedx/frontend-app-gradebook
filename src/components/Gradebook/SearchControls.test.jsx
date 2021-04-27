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
      setGradebookState: jest.fn().mockName('setGradebookState'),
      showSpinner: false,
      toggleFilterDrawer: jest.fn().mockName('toggleFilterDrawer'),
      // From Redux
      getUserGrades: jest.fn().mockName('getUserGrades'),
      searchForUser: jest.fn().mockName('searchForUser'),
      selectedAssignmentType: 'homework',
      selectedCohort: 'spring term',
      selectedTrack: 'masters',
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
          'course-v1:edX+DEV101+T1',
          'bob',
          'spring term',
          'masters',
          'homework',
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
        wrapper.instance().onClear('bob');
        expect(props.getUserGrades).toHaveBeenCalledWith(
          'course-v1:edX+DEV101+T1',
          'spring term',
          'masters',
          'homework',
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
