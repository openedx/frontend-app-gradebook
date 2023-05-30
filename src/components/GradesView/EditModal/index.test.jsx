import React from 'react';
import { shallow } from 'enzyme';

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
      const modalProps = el.find(ModalDialog).props();
      expect(modalProps.title).toEqual(formatMessage(messages.title));
      expect(modalProps.isOpen).toEqual(hookProps.isOpen);
      expect(modalProps.onClose).toEqual(hookProps.onClose);
    });
    const loadBody = () => {
      const body = el.find(ModalDialog).children().at(0);
      const children = body.find('div').children();
      return { body, children };
    };
    const testBody = () => {
      test('type', () => {
        const { body } = loadBody();
        expect(body.type()).toEqual('ModalDialog.Body');
      });
      test('headers row', () => {
        const { children } = loadBody();
        expect(children.at(0)).toMatchObject(shallow(<ModalHeaders />));
      });
      test('table row', () => {
        const { children } = loadBody();
        expect(children.at(2)).toMatchObject(shallow(<OverrideTable />));
      });
      test('messages', () => {
        const { children } = loadBody();
        expect(
          children.at(3).contains(formatMessage(messages.visibility)),
        ).toEqual(true);
        expect(
          children.at(4).contains(formatMessage(messages.saveVisibility)),
        ).toEqual(true);
      });
    };
    const testFooter = () => {
      let footer;
      beforeEach(() => {
        footer = el.find(ModalDialog).children().at(1);
      });
      test('type', () => {
        expect(footer.type()).toEqual('ModalDialog.Footer');
      });
      test('contains action row', () => {
        expect(footer.children().at(0).type()).toEqual('ActionRow');
      });
      test('close button', () => {
        const button = footer.find(ActionRow).children().at(0);
        expect(button.contains(formatMessage(messages.closeText))).toEqual(true);
        expect(button.type()).toEqual('ModalDialog.CloseButton');
      });
      test('adjusted grade button', () => {
        const button = footer.find(ActionRow).children().at(1);
        expect(button.contains(formatMessage(messages.saveGrade))).toEqual(true);
        expect(button.type()).toEqual('Button');
        expect(button.props().onClick).toEqual(hookProps.handleAdjustedGradeClick);
      });
    };
    describe('without error', () => {
      beforeEach(() => {
        useEditModalData.mockReturnValueOnce({ ...hookProps, error: undefined });
        el = shallow(<EditModal />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      testBody();
      testFooter();
      test('alert row', () => {
        const alert = loadBody().children.at(1);
        expect(alert.type()).toEqual('Alert');
        expect(alert.props().show).toEqual(false);
      });
    });
    describe('with error', () => {
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      testBody();
      test('alert row', () => {
        const alert = loadBody().children.at(1);
        expect(alert.type()).toEqual('Alert');
        expect(alert.props().show).toEqual(true);
        expect(alert.contains(hookProps.error)).toEqual(true);
      });
      testFooter();
    });
  });
});
