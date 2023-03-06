import React from 'react';
import { shallow } from 'enzyme';

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
      handleClickImportGrades: jest.fn(),
      handleFileInputChange: jest.fn(),
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
      expect(el).toMatchSnapshot();
    });
    test('Form', () => {
      expect(el.find(Form).props().action).toEqual(props.gradeExportUrl);
      expect(el.find(Form.Control).props().onChange).toEqual(props.handleFileInputChange);
    });
    test('import button', () => {
      expect(el.find(NetworkButton).props().onClick).toEqual(props.handleClickImportGrades);
    });
  });
});
