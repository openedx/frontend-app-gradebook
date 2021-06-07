import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';

import {
  ReasonInput,
  mapStateToProps,
  mapDispatchToProps,
} from './ReasonInput';

jest.mock('@edx/paragon', () => ({
  Form: { Control: () => 'Form.Control' },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      modalState: { reasonForChange: jest.fn(state => ({ reasonForChange: state })) },
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: { setModalState: jest.fn() },
  },
}));
describe('ReasonInput', () => {
  let el;
  let props = {
    value: 'did not answer the question',
  };
  beforeEach(() => {
    props = {
      ...props,
      setModalState: jest.fn(),
    };
  });
  describe('Component', () => {
    beforeEach(() => {
      el = shallow(<ReasonInput {...props} />, { disableLifecycleMethods: true });
    });
    describe('snapshots', () => {
      test('displays reason for change input control', () => {
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
            reasonForChange: value,
          });
        });
      });
      describe('componentDidMount', () => {
        it('focuses the input ref', () => {
          const focus = jest.fn();
          expect(el.instance().ref).toEqual({ current: null });
          el.instance().ref.current = { focus };
          el.instance().componentDidMount();
          expect(el.instance().ref.current.focus).toHaveBeenCalledWith();
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { to: { catchThem: 'my real test', trainThem: 'my cause!' } };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    describe('modalState', () => {
      test('value from app.modalState.reasonForChange', () => {
        expect(mapped.value).toEqual(selectors.app.modalState.reasonForChange(testState));
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('setModalState from actions.app.setModalState', () => {
      expect(mapDispatchToProps.setModalState).toEqual(actions.app.setModalState);
    });
  });
});
