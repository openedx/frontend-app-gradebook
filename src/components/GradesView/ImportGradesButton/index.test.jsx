import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import NetworkButton from 'components/NetworkButton';
import useImportGradesButtonData from './hooks';
import ImportGradesButton from '.';

jest.mock('components/NetworkButton', () => 'NetworkButton');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

let el;
let props;
describe('ImportGradesButton component', () => {
  beforeAll(() => {
    props = {
      fileInputRef: { current: null },
      gradeExportUrl: 'test-grade-export-url',
      handleClickImportGrades: jest.fn().mockName('props.handleClickImportGrades'),
      handleFileInputChange: jest.fn().mockName('props.handleFileInputChange'),
    };
    useImportGradesButtonData.mockReturnValue(props);
    el = shallow(<ImportGradesButton />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useImportGradesButtonData).toHaveBeenCalledWith();
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('Form', () => {
      expect(el.instance.findByType(Form)[0].snapshot).toMatchSnapshot();
      expect(el.instance.findByType(Form)[0].props.action).toEqual(props.gradeExportUrl);
      expect(el.instance.findByType(Form.Control)[0].props.onChange).toEqual(props.handleFileInputChange);
    });
    test('import button', () => {
      expect(el.instance.findByType(NetworkButton)[0].props.onClick).toEqual(props.handleClickImportGrades);
    });
  });
});
