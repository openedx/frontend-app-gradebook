import React from 'react';
import { selectors, thunkActions } from 'data/redux/hooks';

import useImportButtonData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: { useGradeExportUrl: jest.fn() },
  },
  thunkActions: {
    grades: { useSubmitImportGradesButtonData: jest.fn() },
  },
}));

let out;

let submitThen;
const submit = jest.fn().mockReturnValue(new Promise((resolve) => {
  submitThen = resolve;
}));
const gradeExportUrl = 'test-grade-export-url';
selectors.root.useGradeExportUrl.mockReturnValue(gradeExportUrl);
thunkActions.grades.useSubmitImportGradesButtonData.mockReturnValue(submit);

const testFile = 'test-file';
const testFormData = new FormData();
testFormData.append('csv', testFile);

const ref = {
  current: { click: jest.fn(), files: [testFile], value: 'test-value' },
};
describe('useImportButtonData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    React.useRef.mockReturnValue(ref);
    out = useImportButtonData();
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.root.useGradeExportUrl).toHaveBeenCalledWith();
      expect(thunkActions.grades.useSubmitImportGradesButtonData).toHaveBeenCalledWith();
    });
    it('initializes react ref', () => {
      expect(React.useRef).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('handleClickImportGrades', () => {
      it('clicks the file input if populated', () => {
        out.handleClickImportGrades();
        expect(ref.current.click).toHaveBeenCalled();
      });
      it('does not crash if no file input available', () => {
        React.useRef.mockReturnValueOnce({ current: null });
        out = useImportButtonData();
        out.handleClickImportGrades();
        expect(ref.current.click).not.toHaveBeenCalled();
      });
    });
    describe('handleFileInputChange', () => {
      it('does not crash if no file input available', () => {
        React.useRef.mockReturnValueOnce({ current: null });
        out = useImportButtonData();
        out.handleFileInputChange();
      });
      it('submits formData, clearingInput on success', async () => {
        out.handleFileInputChange();
        const [[callArg]] = submit.mock.calls;
        expect([...callArg.entries()]).toEqual([...testFormData.entries()]);
        await submitThen();
        expect(out.fileInputRef.current.value).toEqual(null);
      });
    });
    it('passes fileInputRef from hook', () => {
      expect(out.fileInputRef).toEqual(ref);
    });
    it('passes gradeExportUrl from hook', () => {
      expect(out.gradeExportUrl).toEqual(gradeExportUrl);
    });
  });
});
