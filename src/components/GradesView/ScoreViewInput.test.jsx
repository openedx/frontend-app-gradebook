import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';

import {
  ScoreViewInput,
  mapDispatchToProps,
  mapStateToProps,
} from './ScoreViewInput';

jest.mock('@edx/paragon', () => ({
  FormControl: () => 'FormControl',
  FormGroup: () => 'FormGroup',
  FormLabel: () => 'FormLabel',
}));

jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    grades: { toggleGradeFormat: jest.fn() },
  },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: { gradeFormat: (state) => ({ gradeFormat: state }) },
  },
}));

describe('ScoreViewInput', () => {
  describe('component', () => {
    const props = { format: 'percent' };
    let el;
    beforeEach(() => {
      props.toggleFormat = jest.fn();
      props.intl = { formatMessage: (msg) => msg.defaultMessage };
      el = shallow(<ScoreViewInput {...props} />);
    });
    const assertions = [
      'select box with percent and absolute options',
      'onClick from props.toggleFormat',
    ];
    test(`snapshot - ${assertions.join(' and ')}`, () => {
      expect(el).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    test('format from grades.gradeFormat', () => {
      const testState = { some: 'state' };
      expect(mapStateToProps(testState).format).toEqual(selectors.grades.gradeFormat(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('toggleFormat from actions.grades.toggleGradeFormat', () => {
      expect(mapDispatchToProps.toggleFormat).toEqual(actions.grades.toggleGradeFormat);
    });
  });
});
