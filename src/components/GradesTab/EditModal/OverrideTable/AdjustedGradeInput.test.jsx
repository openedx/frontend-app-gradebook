import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';

import {
  AdjustedGradeInput,
  mapStateToProps,
  mapDispatchToProps,
} from './AdjustedGradeInput';

jest.mock('@edx/paragon', () => ({
  Form: { Control: () => 'Form.Control' },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      editModalPossibleGrade: jest.fn(state => ({ updateUserName: state })),
    },
    app: {
      modalState: { adjustedGradeValue: jest.fn(state => ({ adjustedGradeValue: state })) },
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: { setModalState: jest.fn() },
  },
}));
describe('AdjustedGradeInput', () => {
  let el;
  let props = {
    value: 1,
    possibleGrade: 5,
  };
  beforeEach(() => {
    props = {
      ...props,
      setModalState: jest.fn(),
    };
  });
  describe('Component', () => {
    beforeEach(() => {
      el = shallow(<AdjustedGradeInput {...props} />);
    });
    describe('snapshots', () => {
      test('displays input control and "out of possible grade" label', () => {
        el.instance().onChange = jest.fn().mockName('this.onChange');
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('behavior', () => {
      describe('onChange', () => {
        it('calls props.setModalState event target value', () => {
          const value = 42;
          el.instance().onChange({ target: { value } });
          expect(props.setModalState).toHaveBeenCalledWith({
            adjustedGradeValue: value,
          });
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { like: 'no one', ever: 'was' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    describe('modalState', () => {
      test('possibleGrade from root.editModalPossibleGrade', () => {
        expect(
          mapped.possibleGrade,
        ).toEqual(selectors.root.editModalPossibleGrade(testState));
      });
      test('updateUserName from app.modalState.updateUserName', () => {
        expect(
          mapped.value,
        ).toEqual(selectors.app.modalState.adjustedGradeValue(testState));
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('setModalState from actions.app.setModalState', () => {
      expect(mapDispatchToProps.setModalState).toEqual(actions.app.setModalState);
    });
  });
});
