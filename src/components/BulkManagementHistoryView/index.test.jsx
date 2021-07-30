/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { BulkManagementHistoryView } from '.';
import BulkManagementAlerts from './BulkManagementAlerts';
import HistoryTable from './HistoryTable';
import messages from './messages';

jest.mock('./BulkManagementAlerts', () => 'BulkManagementAlerts');
jest.mock('./HistoryTable', () => 'HistoryTable');

describe('BulkManagementHistoryView', () => {
  describe('component', () => {
    let el;
    beforeEach(() => {
      el = shallow(<BulkManagementHistoryView />);
    });
    describe('snapshot', () => {
      const snapshotSegments = [
        'heading from messages.BulkManagementHistoryView.heading',
        '<BulkManagementAlerts />',
        '<HistoryTable />',
      ];
      test(`snapshot - loads ${snapshotSegments.join(', ')}`, () => {
        expect(el).toMatchSnapshot();
      });
      test('heading - h4 loaded from messages', () => {
        const heading = el.find('h4');
        expect(heading.getElement()).toEqual((
          <h4>
            <FormattedMessage {...messages.heading} />
          </h4>
        ));
      });
      test('heading, then alerts, then upload form, then table', () => {
        expect(el.childAt(0).is('h4')).toEqual(true);
        expect(el.childAt(2).is(BulkManagementAlerts)).toEqual(true);
        expect(el.childAt(3).is(HistoryTable)).toEqual(true);
      });
    });
  });
});
