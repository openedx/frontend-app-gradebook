import React from 'react';
import { render } from '@testing-library/react';

import useImportGradesButtonData from './hooks';
import ImportGradesButton from '.';

jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.mock('components/NetworkButton', () => 'network-button');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const props = {
  fileInputRef: { current: { click: jest.fn() }, useRef: jest.fn() },
  gradeExportUrl: 'test-grade-export-utl',
  handleClickImportGrades: jest.fn(),
  handleFileInputChange: jest.fn(),
};
useImportGradesButtonData.mockReturnValue(props);

let el;
describe('ImportGradesButton ref test', () => {
  it('loads ref from hook', () => {
    el = render(<ImportGradesButton />);
    const input = el.getByTestId('file-control');
    expect(input).toEqual(props.fileInputRef.current);
  });
});
