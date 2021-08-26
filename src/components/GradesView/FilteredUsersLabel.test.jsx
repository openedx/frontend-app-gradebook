import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import { FilteredUsersLabel, mapStateToProps } from './FilteredUsersLabel';

jest.mock('@edx/paragon', () => ({
  Icon: () => 'Icon',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      filteredUsersCount: state => ({ filteredUsersCount: state }),
      totalUsersCount: state => ({ totalUsersCount: state }),
    },
  },
}));

describe('FilteredUsersLabel', () => {
  describe('component', () => {
    const props = {
      filteredUsersCount: 23,
      totalUsersCount: 140,
    };
    it('does not render if totalUsersCount is falsey', () => {
      expect(shallow(<FilteredUsersLabel {...props} totalUsersCount={0} />)).toEqual({});
    });
    test('snapshot - displays label with number of filtered users out of total', () => {
      expect(shallow(<FilteredUsersLabel {...props} />)).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { a: 'nice', day: 'for', some: 'rain' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('filteredUsersCount from grades.filteredUsersCount', () => {
      expect(mapped.filteredUsersCount).toEqual(selectors.grades.filteredUsersCount(testState));
    });
    test('totalUsersCount from grades.totalUsersCount', () => {
      expect(mapped.totalUsersCount).toEqual(selectors.grades.totalUsersCount(testState));
    });
  });
});
