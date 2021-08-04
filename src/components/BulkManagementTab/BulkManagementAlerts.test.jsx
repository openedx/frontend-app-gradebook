import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import messages from './messages';

import { BulkManagementAlerts, mapStateToProps } from './BulkManagementAlerts';

jest.mock('@edx/frontend-platform/i18n', () => ({
  defineMessages: m => m,
  FormattedMessage: () => 'FormattedMessage',
}));
jest.mock('@edx/paragon', () => ({
  Alert: () => 'Alert',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkImportError: (state) => ({ bulkImportError: state }),
      uploadSuccess: (state) => ({ uploadSuccess: state }),
    },
  },
}));

const errorMessage = 'Oh noooooo';

describe('BulkManagementAlerts', () => {
  describe('component', () => {
    let el;
    describe('no errer, no upload success', () => {
      beforeEach(() => {
        el = shallow(<BulkManagementAlerts />);
      });
      test('snapshot - bulkImportError closed, success closed', () => {
        expect(el).toMatchSnapshot();
      });
      test('closed danger alert', () => {
        expect(el.childAt(0).is(Alert)).toEqual(true);
        expect(el.childAt(0).props().show).toEqual(false);
        expect(el.childAt(0).props().variant).toEqual('danger');
      });
      test('closed success alert', () => {
        expect(el.childAt(1).is(Alert)).toEqual(true);
        expect(el.childAt(1).props().show).toEqual(false);
        expect(el.childAt(1).props().variant).toEqual('success');
      });
    });
    describe('no errer, no upload success', () => {
      beforeEach(() => {
        el = shallow(<BulkManagementAlerts uploadSuccess bulkImportError={errorMessage} />);
      });
      const assertions = [
        'danger alert open with bulkImportError',
        'success alert open with messages.successDialog',
      ];
      test(`snapshot - ${assertions.join(', ')}`, () => {
        expect(el).toMatchSnapshot();
      });
      test('open danger alert with bulkImportError content', () => {
        expect(el.childAt(0).is(Alert)).toEqual(true);
        expect(el.childAt(0).children().text()).toEqual(errorMessage);
        expect(el.childAt(0).props().show).toEqual(true);
      });
      test('open success alert with messages.successDialog content', () => {
        expect(el.childAt(1).is(Alert)).toEqual(true);
        expect(el.childAt(1).children().getElement()).toEqual(
          <FormattedMessage {...messages.successDialog} />,
        );
        expect(el.childAt(1).props().show).toEqual(true);
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { a: 'puppy', named: 'Ember' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('bulkImportError from grades.bulkImportError', () => {
      expect(mapped.bulkImportError).toEqual(selectors.grades.bulkImportError(testState));
    });
    test('uploadSuccess from grades.uploadSuccess', () => {
      expect(mapped.uploadSuccess).toEqual(selectors.grades.uploadSuccess(testState));
    });
  });
});
