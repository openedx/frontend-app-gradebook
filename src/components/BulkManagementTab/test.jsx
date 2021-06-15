/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';
import { Button, Form, Table } from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import * as appConstants from 'data/constants/app';
import { BulkManagementTab, mapStateToProps, mapDispatchToProps } from '.';
import BulkManagementAlerts from './BulkManagementAlerts';
import ResultsSummary from './ResultsSummary';

const {
  bulkManagementColumns,
  messages: { BulkManagementTab: messages },
} = appConstants;
jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
  Form: {
    Control: () => 'Form.Control',
    Group: () => 'Form.Group',
    Label: () => 'Form.Label',
  },
  Table: () => 'Table',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkImportError: jest.fn(state => ({ bulkImportError: state })),
      bulkManagementHistoryEntries: jest.fn(state => ({ historyEntries: state })),
    },
    root: {
      gradeExportUrl: jest.fn(state => ({ gradeExportUrl: state })),
    },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    grades: { submitFileUploadFormData: jest.fn() },
  },

}));
jest.mock('./BulkManagementAlerts', () => 'BulkManagementAlerts');
jest.mock('./ResultsSummary', () => 'ResultsSummary');

describe('BulkManagementTab', () => {
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
      gradeExportUrl: 'fakeURL',
      bulkManagementHistory: [entry1, entry2],
    };
    let el;
    beforeEach(() => {
      props.submitFileUploadFormData = jest.fn();
    });
    describe('snapshot', () => {
      beforeEach(() => {
        el = shallow(<BulkManagementTab {...props} />);
      });
      const snapshotSegments = [
        'heading',
        'export form w/ alerts and file input',
        'import btn',
        'hints display',
        'formatted table',
      ];
      test(`snapshot - loads ${snapshotSegments.join(', ')}`, () => {
        el.instance().handleFileInputChange = jest.fn().mockName('this.handleFileInputChange');
        el.instance().fileInputRef = jest.fn().mockName('this.fileInputRef');
        el.instance().handleClickImportGrades = jest.fn().mockName('this.handleClickImportGrades');
        el.instance().formatHistoryRow = jest.fn(entry => entry.originalFilename);
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('heading - h4 loaded from messages', () => {
        const heading = el.find('h4');
        expect(heading.text()).toEqual(messages.heading);
      });
      describe('alert form', () => {
        let form;
        beforeEach(() => {
          form = el.find('form');
        });
        test('post action points to gradeExportUrl', () => {
          expect(form.props().action).toEqual(props.gradeExportUrl);
          expect(form.props().method).toEqual('post');
        });
        test('loads BulkManagementAlerts', () => {
          expect(form.find(BulkManagementAlerts).length).toEqual(1);
        });
        describe('file input', () => {
          let fileInput;
          beforeEach(() => {
            fileInput = form.find(Form.Group);
          });
          test('group with controlId="csv"', () => {
            expect(fileInput.props().controlId).toEqual('csv');
          });
          test('label with csvUploadLabel message', () => {
            expect(fileInput.find(Form.Label).children().text()).toEqual(messages.csvUploadLabel);
          });
          test('file control with onChange from handleFileInputChange', () => {
            expect(
              fileInput.find(Form.Control).props().onChange,
            ).toEqual(el.instance().handleFileInputChange);
          });
        });
      });
      describe('import button', () => {
        let btn;
        beforeEach(() => {
          btn = el.find(Button);
        });
        test('handleClickImportGrade on click', () => {
          expect(btn.props().onClick).toEqual(el.instance().handleClickImportGrades);
        });
        test('text from messages.importBtn', () => {
          expect(btn.children().text()).toEqual(messages.importBtn);
        });
      });
      test('hints with break in between', () => {
        const hints = el.find('p');
        expect(hints.childAt(0).text()).toEqual(messages.hints[0]);
        expect(hints.childAt(1).is('br')).toEqual(true);
        expect(hints.childAt(2).text()).toEqual(messages.hints[1]);
      });
      describe('history table', () => {
        let table;
        beforeEach(() => {
          table = el.find(Table);
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
    describe('behavior', () => {
      let fileInput;
      beforeEach(() => {
        fileInput = jest.spyOn(el.instance(), 'fileInput', 'get');
      });
      describe('handleFileInputChange', () => {
        it('does nothing (does not fail) if fileInput has not loaded', () => {
          fileInput.mockReturnValue(null);
          el.instance().handleClickImportGrades();
        });
        it('calls fileInput.click if is loaded', () => {
          const click = jest.fn();
          fileInput.mockReturnValue({ click });
          el.instance().handleClickImportGrades();
          expect(click).toHaveBeenCalled();
        });
      });
      describe('handleClickImportGrades', () => {
        it('does nothing if file input has not loaded with files', () => {
          fileInput.mockReturnValue(null);
          el.instance().handleFileInputChange();
          expect(props.submitFileUploadFormData).not.toHaveBeenCalled();
          fileInput.mockReturnValue({ files: [] });
          el.instance().handleFileInputChange();
          expect(props.submitFileUploadFormData).not.toHaveBeenCalled();
        });
        it('calls submitFileUploadFormData and then clears fileInput if has files', () => {
          fileInput.mockReturnValue({ files: ['some', 'files'], value: 'a value' });
          const formData = { fake: 'form data' };
          jest.spyOn(el.instance(), 'formData', 'get').mockReturnValue(formData);
          const submit = jest.fn(() => ({ then: (thenCB) => { thenCB(); } }));
          el.setProps({
            submitFileUploadFormData: submit,
          });
          el.instance().handleFileInputChange();
          expect(submit).toHaveBeenCalledWith(formData);
          expect(el.instance().fileInput.value).toEqual(null);
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
    test('gradeExportUrl from root.gradeExportUrl', () => {
      expect(mapped.gradeExportUrl).toEqual(selectors.root.gradeExportUrl(testState));
    });
  });

  describe('mapDispatchToProps', () => {
    test('submitFileUploadFormData from thunkActions.grades', () => {
      expect(
        mapDispatchToProps.submitFileUploadFormData,
      ).toEqual(thunkActions.grades.submitFileUploadFormData);
    });
  });
});
