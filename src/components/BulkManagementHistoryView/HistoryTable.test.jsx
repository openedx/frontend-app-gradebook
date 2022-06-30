/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';
import { DataTable } from '@edx/paragon';

import selectors from 'data/selectors';
import { bulkManagementColumns } from 'data/constants/app';

import ResultsSummary from './ResultsSummary';
import { HistoryTable, mapStateToProps } from './HistoryTable';

jest.mock('@edx/paragon', () => ({ DataTable: () => 'DataTable' }));

jest.mock('@edx/frontend-platform/i18n', () => ({
  defineMessages: m => m,
  FormattedMessage: () => 'FormattedMessage',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkManagementHistoryEntries: jest.fn(state => ({ historyEntries: state })),
    },
  },
}));
jest.mock('./ResultsSummary', () => 'ResultsSummary');

describe('HistoryTable', () => {
  describe('component', () => {
    const entry1 = {
      originalFilename: 'blue.png',
      user: 'Eifel',
      timeUploaded: '65',
      resultsSummary: {
        rowId: 12,
        courseId: 'Da Bu Dee',
        text: 'Da ba daa',
      },
    };
    const entry2 = {
      originalFilename: 'allStar.jpg',
      user: 'Smashmouth',
      timeUploaded: '2000s?',
      resultsSummary: {
        courseId: 'rockstar',
        rowId: 2,
        text: 'all that glitters is gold',
      },
    };
    const props = {
      bulkManagementHistory: [entry1, entry2],
    };
    let el;
    describe('snapshot', () => {
      beforeEach(() => {
        el = shallow(<HistoryTable {...props} />);
      });
      test('snapshot - loads formatted table', () => {
        expect(el).toMatchSnapshot();
      });
      describe('history table', () => {
        let table;
        beforeEach(() => {
          table = el.find(DataTable);
        });
        describe('data (from bulkManagementHistory.map(this.formatHistoryRow)', () => {
          const fieldAssertions = [
            'maps resultsSummay to ResultsSummary',
            'wraps filename and user',
            'forwards the rest',
          ];
          test(`snapshot: ${fieldAssertions.join(', ')}`, () => {
            expect(table.props().data).toMatchSnapshot();
          });
          test(fieldAssertions.join(', '), () => {
            const rows = table.props().data;
            expect(rows[0].resultsSummary).toEqual(<ResultsSummary {...entry1.resultsSummary} />);
            expect(rows[0].user).toEqual(<span className="wrap-text-in-cell">{entry1.user}</span>);
            expect(
              rows[0].filename,
            ).toEqual(<span className="wrap-text-in-cell">{entry1.originalFilename}</span>);
            expect(rows[1].resultsSummary).toEqual(<ResultsSummary {...entry2.resultsSummary} />);
            expect(rows[1].user).toEqual(<span className="wrap-text-in-cell">{entry2.user}</span>);
            expect(
              rows[1].filename,
            ).toEqual(<span className="wrap-text-in-cell">{entry2.originalFilename}</span>);
          });
        });
        test('columns from bulkManagementColumns', () => {
          expect(table.props().columns).toEqual(bulkManagementColumns);
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { a: 'simple', test: 'state' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('bulkManagementHistory from grades.bulkManagementHistoryEntries', () => {
      expect(
        mapped.bulkManagementHistory,
      ).toEqual(selectors.grades.bulkManagementHistoryEntries(testState));
    });
  });
});
