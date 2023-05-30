import React from 'react';
import { shallow } from 'enzyme';

import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { selectors } from 'data/redux/hooks';

import FilteredUsersLabel, { BoldText } from '.';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: {
      useUserCounts: jest.fn(),
    },
  },
}));

const userCounts = {
  filteredUsersCount: 100,
  totalUsersCount: 123,
};
selectors.grades.useUserCounts.mockReturnValue(userCounts);

let el;
describe('FilteredUsersLabel component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<FilteredUsersLabel />);
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.grades.useUserCounts).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('null render if totalUsersCount is 0', () => {
      selectors.grades.useUserCounts.mockReturnValueOnce({
        ...userCounts,
        totalUsersCount: 0,
      });
      expect(shallow(<FilteredUsersLabel />).isEmptyRender()).toEqual(true);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
      expect(el).toMatchObject(shallow(formatMessage(messages.visibilityLabel, {
        filteredUsers: <BoldText text={userCounts.filteredUsersCount} />,
        totalUsers: <BoldText text={userCounts.totalUsersCount} />,
      })));
    });
  });
});
