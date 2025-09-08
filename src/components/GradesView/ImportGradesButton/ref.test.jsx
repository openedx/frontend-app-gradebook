import React from 'react';
import useImportGradesButtonData from './hooks';
import ImportGradesButton from '.';
import { renderWithIntl, screen } from '../../../testUtilsExtra';

jest.mock('components/NetworkButton', () => 'network-button');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const props = {
  fileInputRef: { current: { click: jest.fn() }, useRef: jest.fn() },
  gradeExportUrl: 'test-grade-export-utl',
  handleClickImportGrades: jest.fn(),
  handleFileInputChange: jest.fn(),
};
useImportGradesButtonData.mockReturnValue(props);

describe('ImportGradesButton ref test', () => {
  it('loads ref from hook', () => {
    renderWithIntl(<ImportGradesButton />);
    const input = screen.getByTestId('file-control');
    expect(input).toEqual(props.fileInputRef.current);
  });
});
