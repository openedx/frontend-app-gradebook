import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';
import { mapDispatchToProps, mapStateToProps, SearchControls } from './SearchControls';

jest.mock('@edx/paragon', () => ({
  Icon: 'Icon',
  Button: 'Button',
  SearchField: 'SearchField',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      searchValue: jest.fn(state => ({ searchValue: state })),
    },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    grades: {
      fetchGrades: jest.fn().mockName('thunkActions.grades.fetchGrades'),
    },
    app: {
      filterMenu: { toggle: jest.fn().mockName('thunkActions.app.filterMenu') },
    },
  },
}));

describe('SearchControls', () => {
  let props;

  beforeEach(() => {
    jest.resetAllMocks();
    props = {
      searchValue: 'alice',
      setSearchValue: jest.fn(),
      fetchGrades: jest.fn().mockName('fetchGrades'),
    };
  });

  const searchControls = (overriddenProps) => {
    props = { ...props, ...overriddenProps };
    return shallow(<SearchControls {...props} />);
  };

  describe('Component', () => {
    describe('Snapshots', () => {
      test('basic snapshot', () => {
        const wrapper = searchControls();
        wrapper.instance().onChange = jest.fn().mockName('onChange');
        wrapper.instance().onClear = jest.fn().mockName('onClear');
        expect(wrapper.instance().render()).toMatchSnapshot();
      });
    });

    describe('onChange', () => {
      it('saves the changed search value to Gradebook state', () => {
        const wrapper = searchControls();
        wrapper.instance().onChange('bob');
        expect(props.setSearchValue).toHaveBeenCalledWith('bob');
      });
    });

    describe('onChange', () => {
      it('sets search value to empty string and calls fetchGrades', () => {
        const wrapper = searchControls();
        wrapper.instance().onClear();
        expect(props.setSearchValue).toHaveBeenCalledWith('');
        expect(props.fetchGrades).toHaveBeenCalled();
      });
    });

    describe('mapStateToProps', () => {
      const testState = { never: 'gonna', give: 'you up' };
      test('searchValue from app.searchValue', () => {
        expect(
          mapStateToProps(testState).searchValue,
        ).toEqual(selectors.app.searchValue(testState));
      });
    });
    describe('mapDispatchToProps', () => {
      test('fetchGrades from thunkActions.grades.fetchGrades', () => {
        expect(mapDispatchToProps.fetchGrades).toEqual(thunkActions.grades.fetchGrades);
      });

      test('setSearchValue from actions.app.setSearchValue', () => {
        expect(mapDispatchToProps.setSearchValue).toEqual(actions.app.setSearchValue);
      });
    });
  });
});
