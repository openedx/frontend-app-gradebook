import React from 'react';

import { initializeMocks, render } from '../../../testUtilsExtra';
import * as hooks from './hooks';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: { useAllGrades: jest.fn(() => []) },
    root: { useGetHeadings: jest.fn(() => []) },
  },
}));

jest.mock('data/redux/transforms', () => ({
  grades: { roundGrade: jest.fn((val) => val) },
}));

jest.mock('i18n/utils', () => ({ getLocalizedPercentSign: () => '%' }));
jest.mock('./Fields', () => ({ Username: () => null, Text: () => null }));
jest.mock('./GradeButton', () => ({ __esModule: true, default: () => null }));
jest.mock('./LabelReplacements', () => ({
  TotalGradeLabelReplacement: () => null,
  UsernameLabelReplacement: () => null,
  MastersOnlyLabelReplacement: () => null,
}));

describe('useGradebookTableData hook', () => {
  let hookResult;

  const TestComponent = () => {
    hookResult = hooks.useGradebookTableData();
    return null;
  };

  beforeEach(() => {
    initializeMocks();
    hookResult = null;
  });

  it('returns expected structure with empty data', () => {
    render(<TestComponent />);
    expect(hookResult).toEqual({
      columns: [],
      data: [],
      grades: [],
      nullMethod: expect.any(Function),
      emptyContent: expect.any(String),
    });
  });

  it('nullMethod returns null', () => {
    render(<TestComponent />);
    expect(hookResult.nullMethod()).toBeNull();
  });
});
