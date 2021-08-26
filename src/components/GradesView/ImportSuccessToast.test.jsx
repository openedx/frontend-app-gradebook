import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import actions from 'data/actions';
import { views } from 'data/constants/app';

import {
  ImportSuccessToast,
  mapStateToProps,
  mapDispatchToProps,
} from './ImportSuccessToast';
import messages from './ImportSuccessToast.messages';

jest.mock('@edx/paragon', () => ({
  Toast: () => 'Toast',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      showImportSuccessToast: (state) => ({ showImportSuccessToast: state }),
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: {
      setView: jest.fn(),
      setShow: jest.fn(),
    },
  },
}));

describe('ImportSuccessToast component', () => {
  describe('snapshots', () => {
    let el;
    let props = {
      show: true,
    };
    beforeEach(() => {
      props = {
        ...props,
        intl: { formatMessage: (msg) => msg.defaultMessage },
        setAppView: jest.fn(),
        setShow: jest.fn(),
      };
      el = shallow(<ImportSuccessToast {...props} />);
    });
    test('snapshot', () => {
      el.instance().handleShowHistoryView = jest.fn().mockName('handleShowHistoryView');
      el.instance().onClose = jest.fn().mockName('onClose');
      expect(el).toMatchSnapshot();
    });
    describe('Toast props', () => {
      let toastProps;
      beforeEach(() => {
        toastProps = el.props();
      });
      test('action has translated label and onClick from this.handleShowHistoryView', () => {
        expect(toastProps.action).toEqual({
          label: props.intl.formatMessage(messages.showHistoryViewBtn),
          onClick: el.instance().handleShowHistoryView,
        });
      });
      test('onClose from this.onClose method', () => {
        expect(toastProps.onClose).toEqual(el.instance().onClose);
      });
      test('show from show prop', () => {
        expect(toastProps.show).toEqual(props.show);
        el.setProps({ show: false });
        expect(el.props().show).toEqual(false);
      });
    });
    describe('onClose', () => {
      it('calls props.setShow(false)', () => {
        el.instance().onClose();
        expect(props.setShow).toHaveBeenCalledWith(false);
      });
    });
    describe('handleShowHistoryView', () => {
      it('calls setAppView with views.bulkManagementHistory and this.onClose', () => {
        el.instance().onClose = jest.fn();
        el.instance().handleShowHistoryView();
        expect(props.setAppView).toHaveBeenCalledWith(views.bulkManagementHistory);
        expect(el.instance().onClose).toHaveBeenCalled();
      });
    });
  });
  describe('behavior', () => {
  });
  describe('mapStateToProps', () => {
    const testState = { somewhere: 'over', the: 'rainbow' };
    const mapped = mapStateToProps(testState);
    test('show from app showImportSuccessToast selector', () => {
      expect(mapped.show).toEqual(
        selectors.app.showImportSuccessToast(testState),
      );
    });
  });
  describe('mapDispatchToProps', () => {
    test('setAppView from actions.app.setView', () => {
      expect(mapDispatchToProps.setAppView).toEqual(actions.app.setView);
    });
    test('setShow from actions.setShowImportSuccessToast', () => {
      expect(mapDispatchToProps.setShow).toEqual(actions.app.setShowImportSuccessToast);
    });
  });
});
