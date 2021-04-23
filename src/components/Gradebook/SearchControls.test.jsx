import React from 'react';
import { shallow } from 'enzyme';

import { SearchControls } from './SearchControls';

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
      it('shows a spinner overlay when the page is waiting for some action to complete', () => {
        const wrapper = searchControls({ showSpinner: true });
        expect(wrapper.find('.spinner-overlay').exists()).toEqual(true);
      });

      it('does not show a spinner overlay when page indicates it is not loading', () => {
        const wrapper = searchControls();
        expect(wrapper.find('.spinner-overlay').exists()).toEqual(false);
      });
    });

    describe('edit filters button', () => {
      it('when clicked, sends the signal to toggle the filter drawer', () => {
        const wrapper = searchControls();
        const button = wrapper.find('#edit-filters-btn').at(0);
        button.simulate('click');

        expect(props.toggleFilterDrawer).toHaveBeenCalled();
      });
    });

    describe('Snapshots', () => {
      it('renders', () => {
        expect(shallow(<SearchControls {...props} />)).toMatchSnapshot();
      });
    });
  });
});
