/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';
import TestRenderer from 'react-test-renderer';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { FileUploadForm, mapStateToProps, mapDispatchToProps } from './FileUploadForm';

import messages from './messages';

/*
jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
  Form: () => 'Form',
  FormControl: () => 'FormControl',
  FormGroup: () => 'FormGroup',
}));
*/
jest.mock('@edx/frontend-platform/i18n', () => ({
  defineMessages: m => m,
  FormattedMessage: () => 'FormattedMessage',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkImportError: jest.fn(state => ({ bulkImportError: state })),
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

const mockRef = { click: jest.fn(), files: [] };

describe('FileUploadForm', () => {
  beforeEach(() => {
    mockRef.click.mockClear();
  });
  describe('component', () => {
    let props;
    let el;
    let inst;
    beforeEach(() => {
      props = {
        gradeExportUrl: 'fakeUrl',
        submitFileUploadFormData: jest.fn(),
      };
    });
    describe('snapshot', () => {
      const snapshotSegments = [
        'export form w/ alerts and file input',
        'import btn',
      ];
      test(`snapshot - loads ${snapshotSegments.join(', ')}`, () => {
        jest.mock('@edx/paragon', () => ({
          Button: () => 'Button',
          Form: () => 'Form',
          FormControl: () => 'FormControl',
          FormGroup: () => 'FormGroup',
        }));
        el = shallow(<FileUploadForm {...props} />);
        el.instance().handleFileInputChange = jest.fn().mockName('this.handleFileInputChange');
        el.instance().fileInputRef = jest.fn().mockName('this.fileInputRef');
        el.instance().handleClickImportGrades = jest.fn().mockName('this.handleClickImportGrades');
        el.instance().formatHistoryRow = jest.fn(entry => entry.originalFilename);
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
    describe('render', () => {
      beforeEach(() => {
        el = TestRenderer.create(
          <FileUploadForm {...props} />,
          { createNodeMock: () => mockRef },
        );
        inst = el.root;
      });
      describe('alert form', () => {
        let form;
        beforeEach(() => {
          form = inst.findByType(Form);
        });
        test('post action points to gradeExportUrl', () => {
          expect(form.props.action).toEqual(props.gradeExportUrl);
          expect(form.props.method).toEqual('post');
        });
        describe('file input', () => {
          let formGroup;
          beforeEach(() => {
            formGroup = inst.findByType(FormGroup);
          });
          test('group with controlId="csv"', () => {
            expect(formGroup.props.controlId).toEqual('csv');
          });
          test('file control with onChange from handleFileInputChange', () => {
            const control = inst.findByType(FormControl);
            expect(
              control.props.onChange,
            ).toEqual(el.getInstance().handleFileInputChange);
          });
          test('fileInputRef points to control', () => {
            expect(
              // eslint-disable-next-line no-underscore-dangle
              inst.findByType(FormControl)._fiber.ref,
            ).toEqual(el.getInstance().fileInputRef);
          });
        });
      });
      describe('import button', () => {
        let btn;
        beforeEach(() => {
          btn = inst.findByType(Button);
        });
        test('handleClickImportGrade on click', () => {
          expect(btn.props.onClick).toEqual(el.getInstance().handleClickImportGrades);
        });
        test('text from messages.importBtn', () => {
          const messageEl = btn.findByType(FormattedMessage);
          expect(messageEl.props).toEqual(messages.importBtnText);
        });
      });
    });
    describe('fileInput helper', () => {
      test('links to fileInputRef.current', () => {
        el = TestRenderer.create(
          <FileUploadForm {...props} />,
          { createNodeMock: () => mockRef },
        );
        expect(el.getInstance().fileInput).not.toEqual(undefined);
        expect(el.getInstance().fileInput).toEqual(el.getInstance().fileInputRef.current);
      });
    });
    describe('behavior', () => {
      let fileInput;
      beforeEach(() => {
        el = TestRenderer.create(
          <FileUploadForm {...props} />,
          { createNodeMock: () => mockRef },
        );
        fileInput = jest.spyOn(el.getInstance(), 'fileInput', 'get');
      });
      describe('handleFileInputChange', () => {
        it('does nothing (does not fail) if fileInput has not loaded', () => {
          fileInput.mockReturnValue(null);
          el.getInstance().handleClickImportGrades();
          expect(mockRef.click).not.toHaveBeenCalled();
        });
        it('calls fileInput.click if is loaded', () => {
          el.getInstance().handleClickImportGrades();
          expect(mockRef.click).toHaveBeenCalled();
        });
      });
      describe('handleClickImportGrades', () => {
        it('does nothing if file input has not loaded with files', () => {
          fileInput.mockReturnValue(null);
          el.getInstance().handleFileInputChange();
          expect(props.submitFileUploadFormData).not.toHaveBeenCalled();
          fileInput.mockReturnValue({ files: [] });
          el.getInstance().handleFileInputChange();
          expect(props.submitFileUploadFormData).not.toHaveBeenCalled();
        });
        it('calls submitFileUploadFormData and then clears fileInput if has files', () => {
          fileInput.mockReturnValue({ files: ['some', 'files'], value: 'a value' });
          const formData = { fake: 'form data' };
          jest.spyOn(el.getInstance(), 'formData', 'get').mockReturnValue(formData);
          const submit = jest.fn(() => ({ then: (thenCB) => { thenCB(); } }));
          el.update(<FileUploadForm {...props} submitFileUploadFormData={submit} />);
          el.getInstance().handleFileInputChange();
          expect(submit).toHaveBeenCalledWith(formData);
          expect(el.getInstance().fileInput.value).toEqual(null);
        });
      });
      describe('formData', () => {
        test('returns FormData object with csv value from fileInput.files[0]', () => {
          const file = { a: 'fake file' };
          const value = 'aValue';
          fileInput.mockReturnValue({ files: [file], value });
          const expected = new FormData();
          expected.append('csv', file);
          expect([...el.getInstance().formData.entries()]).toEqual([...expected.entries()]);
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
