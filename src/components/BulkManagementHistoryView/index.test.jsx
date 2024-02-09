/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
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
        expect(el.snapshot).toMatchSnapshot();
      });
      test('heading - h4 loaded from messages', () => {
        const heading = el.instance.findByType('h4')[0];
        const expectedHeading = shallow(
          <h4>
            <FormattedMessage {...messages.heading} />
          </h4>,
        );

        expect(heading.el.type).toEqual(expectedHeading.type);
        expect(heading.el.props).toEqual(expectedHeading.props);
      });
      test('heading, then alerts, then upload form, then table', () => {
        expect(el.instance.children[0].type).toEqual('h4');
        expect(el.instance.children[2].type).toEqual(BulkManagementAlerts);
        expect(el.instance.children[3].type).toEqual(HistoryTable);
      });
    });
  });
});
