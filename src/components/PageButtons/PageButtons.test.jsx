import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import { PageButtons, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      nextPage: jest.fn(state => ({ nextPage: state })),
      prevPage: jest.fn(state => ({ prevPage: state })),
    },
  },
}));

jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    grades: {
      fetchPrevNextGrades: jest.fn(),
    },
  },
}));

let props;
let el;
describe('PageButtons component', () => {
  beforeEach(() => {
    props = {
      getPrevNextGrades: jest.fn(),
      nextPage: 'NEXT PAGE',
      prevPage: 'prev PAGE',
    };
  });
  describe('snapshots', () => {
    beforeEach(() => {
      el = shallow(<PageButtons {...props} />);
      el.instance.fetchNextGrades = jest.fn().mockName('fetchNextGrades');
      el.instance.fetchPrevGrades = jest.fn().mockName('fetchPrevGrades');
    });
    test('buttons enabled with both endpoints provided', () => {
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('nextPage disabled if not provided', () => {
      el.setProps({ nextPage: undefined });
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('prevPage disabled if not provided', () => {
      el.setProps({ prevPage: undefined });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });
  describe('behavior', () => {
    beforeEach(() => {
      el = shallow(<PageButtons {...props} />);
    });
    describe('getPrevGrades', () => {
      it('calls props.getPrevNextGrades with props.prevPage', () => {
        el.instance().getPrevGrades();
        expect(props.getPrevNextGrades).toHaveBeenCalledWith(props.prevPage);
      });
    });
    describe('getNextGrades', () => {
      it('calls props.getPrevNextGrades with props.nextPage', () => {
        el.instance().getNextGrades();
        expect(props.getPrevNextGrades).toHaveBeenCalledWith(props.nextPage);
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { l: 'eeeerroooooy', j: 'jjjjeeeeeeenkins' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('nextPage from grades.nextPage', () => {
      expect(mapped.nextPage).toEqual(selectors.grades.nextPage(testState));
    });
    test('prevPage from grades.prevPage', () => {
      expect(mapped.prevPage).toEqual(selectors.grades.prevPage(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('getPrevNextGrades from thunkActions.grades.fetchPrevNextGrades', () => {
      expect(
        mapDispatchToProps.getPrevNextGrades,
      ).toEqual(thunkActions.grades.fetchPrevNextGrades);
    });
  });
});
