import React from 'react';

import { actions, selectors } from 'data/redux/hooks';
import useReasonInputData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    app: {
      useModalData: jest.fn(),
    },
  },
  actions: {
    app: {
      useSetModalState: jest.fn(),
    },
  },
}));

const modalData = { reasonForChange: 'test-reason-for-change' };
const setModalState = jest.fn();
selectors.app.useModalData.mockReturnValue(modalData);
actions.app.useSetModalState.mockReturnValue(setModalState);

const ref = { current: { focus: jest.fn() }, useRef: true };
React.useRef.mockReturnValue(ref);

let out;
describe('useReasonInputData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useReasonInputData();
  });
  describe('behavior', () => {
    it('initializes ref', () => {
      expect(React.useRef).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.app.useModalData).toHaveBeenCalled();
      expect(actions.app.useSetModalState).toHaveBeenCalled();
    });
    it('focuses ref on load', () => {
      const [[cb, prereqs]] = React.useEffect.mock.calls;
      expect(prereqs).toEqual([ref]);
      cb();
      expect(ref.current.focus).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    it('forwards reasonForChange as value from modal data', () => {
      expect(out.value).toEqual(modalData.reasonForChange);
    });
    it('forwards ref', () => {
      expect(out.ref).toEqual(ref);
    });
    describe('onChange', () => {
      it('sets modal state with event target value', () => {
        const testValue = 'test-value';
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ reasonForChange: testValue });
      });
    });
  });
});
