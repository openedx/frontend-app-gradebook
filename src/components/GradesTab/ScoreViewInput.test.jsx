import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';

import { ScoreViewInput, mapDispatchToProps } from './ScoreViewInput';

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

describe('ScoreViewInput', () => {
  describe('component', () => {
    let props;
    let el;
    beforeEach(() => {
      props = { toggleFormat: jest.fn() };
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
  describe('mapDispatchToProps', () => {
    test('toggleFormat from actions.grades.toggleGradeFormat', () => {
      expect(mapDispatchToProps.toggleFormat).toEqual(actions.grades.toggleGradeFormat);
    });
  });
});
