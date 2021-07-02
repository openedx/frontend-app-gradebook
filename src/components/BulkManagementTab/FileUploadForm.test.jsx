/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
} from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import * as appConstants from 'data/constants/app';

import { FileUploadForm, mapStateToProps, mapDispatchToProps } from './FileUploadForm';

const {
  messages: { BulkManagementTab: messages },
} = appConstants;

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

describe('FileUploadForm', () => {
  describe('component', () => {
    let props;
    let el;
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
        el = mount(<FileUploadForm {...props} />);
      });
      describe('alert form', () => {
        let form;
        beforeEach(() => {
          form = el.find(Form);
        });
        test('post action points to gradeExportUrl', () => {
          expect(form.props().action).toEqual(props.gradeExportUrl);
          expect(form.props().method).toEqual('post');
        });
        describe('file input', () => {
          let formGroup;
          beforeEach(() => {
            formGroup = el.find(FormGroup);
          });
          test('group with controlId="csv"', () => {
            expect(formGroup.props().controlId).toEqual('csv');
          });
          test('file control with onChange from handleFileInputChange', () => {
            const control = el.find(FormControl);
            expect(
              control.props().onChange,
            ).toEqual(el.instance().handleFileInputChange);
          });
          test('fileInputRef points to control', () => {
            expect(el.find(FormControl).getElement().ref).toBe(el.instance().fileInputRef);
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
          expect(btn.children().text()).toEqual(messages.importBtnText);
        });
      });
    });
    describe('fileInput helper', () => {
      test('links to fileInputRef.current', () => {
        el = mount(<FileUploadForm {...props} />);
        const ref = 'a-fake-ref';
        el.instance().fileInputRef = { current: ref };
        expect(el.instance().fileInput).toEqual(ref);
      });
    });
    describe('behavior', () => {
      let fileInput;
      beforeEach(() => {
        el = mount(<FileUploadForm {...props} />);
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
      describe('formData', () => {
        test('returns FormData object with csv value from fileInput.files[0]', () => {
          const file = { a: 'fake file' };
          const value = 'aValue';
          fileInput.mockReturnValue({ files: [file], value });
          const expected = new FormData();
          expected.append('csv', file);
          expect([...el.instance().formData.entries()]).toEqual([...expected.entries()]);
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
