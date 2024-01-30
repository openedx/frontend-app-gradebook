import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import {
  ActionRow,
  ModalDialog,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';

import ModalHeaders from './ModalHeaders';
import OverrideTable from './OverrideTable';
import useEditModalData from './hooks';
import EditModal from '.';
import messages from './messages';

jest.mock('./hooks', () => jest.fn());
jest.mock('./ModalHeaders', () => 'ModalHeaders');
jest.mock('./OverrideTable', () => 'OverrideTable');

const hookProps = {
  onClose: jest.fn().mockName('hooks.onClose'),
  error: 'test-error',
  handleAdjustedGradeClick: jest.fn().mockName('hooks.handleAdjustedGradeClick'),
  isOpen: 'test-is-open',
};
useEditModalData.mockReturnValue(hookProps);

let el;
describe('EditModal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<EditModal />);
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes component hooks', () => {
      expect(useEditModalData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('modal props', () => {
      const modalProps = el.instance.findByType(ModalDialog)[0].props;
      expect(modalProps.title).toEqual(formatMessage(messages.title));
      expect(modalProps.isOpen).toEqual(hookProps.isOpen);
      expect(modalProps.onClose).toEqual(hookProps.onClose);
    });
    const loadBody = () => {
      const body = el.instance.findByType(ModalDialog)[0].children[0];
      const { children } = body.children[0];
      return { body, children };
    };
    const testBody = () => {
      test('type', () => {
        const { body } = loadBody();
        expect(body.type).toEqual('ModalDialog.Body');
      });
      test('headers row', () => {
        const { children } = loadBody();
        expect(children[0]).toMatchObject(shallow(<ModalHeaders />));
      });
      test('table row', () => {
        const { children } = loadBody();
        expect(children[2]).toMatchObject(shallow(<OverrideTable />));
      });
      test('messages', () => {
        const { children } = loadBody();
        expect(children[3].children[0].el).toEqual(formatMessage(messages.visibility));
        expect(children[4].children[0].el).toEqual(formatMessage(messages.saveVisibility));
      });
    };
    const testFooter = () => {
      let footer;
      beforeEach(() => {
        footer = el.instance.findByType(ModalDialog)[0].children;
      });
      test('type', () => {
        expect(footer[1].type).toEqual('ModalDialog.Footer');
      });
      test('contains action row', () => {
        expect(footer[1].children[0].type).toEqual('ActionRow');
      });
      test('close button', () => {
        const button = footer[1].findByType(ActionRow)[0].children[0];
        expect(button.children[0].el).toEqual(formatMessage(messages.closeText));
        expect(button.type).toEqual('ModalDialog.CloseButton');
      });
      test('adjusted grade button', () => {
        const button = footer[1].findByType(ActionRow)[0].children[1];
        expect(button.children[0].el).toEqual(formatMessage(messages.saveGrade));
        expect(button.type).toEqual('Button');
        expect(button.props.onClick).toEqual(hookProps.handleAdjustedGradeClick);
      });
    };
    describe('without error', () => {
      beforeEach(() => {
        useEditModalData.mockReturnValueOnce({ ...hookProps, error: undefined });
        el = shallow(<EditModal />);
      });
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      testBody();
      testFooter();
      test('alert row', () => {
        const alert = loadBody().children[1];
        expect(alert.type).toEqual('Alert');
        expect(alert.props.show).toEqual(false);
      });
    });
    describe('with error', () => {
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      testBody();
      test('alert row', () => {
        const alert = loadBody().children[1];
        expect(alert.type).toEqual('Alert');
        expect(alert.props.show).toEqual(true);
        expect(alert.children[0].el).toEqual(hookProps.error);
      });
      testFooter();
    });
  });
});
