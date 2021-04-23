import React from 'react';
import { shallow } from 'enzyme';

import { SearchControls } from './SearchControls';

describe('SearchControls', () => {
  const props = {
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

  describe('Component', () => {
    describe('Snapshots', () => {
      it('renders', () => {
        expect(shallow(<SearchControls {...props} />)).toMatchSnapshot();
      });
    });
  });
});
