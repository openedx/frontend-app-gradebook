import React from 'react';
import { Headings } from 'data/constants/grades';

import { initializeMocks, render } from '../../../testUtilsExtra';
import * as hooks from './hooks';
import messages from './messages';

let mockUseAllGrades;
let mockUseGetHeadings;

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: { useAllGrades: () => mockUseAllGrades() },
    root: { useGetHeadings: () => mockUseGetHeadings() },
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

const subsectionLabels = [
  'subsectionLabel1',
  'subsectionLabel2',
  'subsectionLabel3',
];

const allGrades = [
  {
    username: 'test-username-1',
    external_user_key: 'EKey1',
    email: 'email-1',
    fullName: 'test-fullNAME',
    percent: 0.9,
    section_breakdown: [
      { label: subsectionLabels[0] },
      { label: subsectionLabels[1] },
      { label: subsectionLabels[2] },
    ],
  },
  {
    username: 'test-username-2',
    external_user_key: 'EKey2',
    email: 'email-2',
    percent: 0.8,
    section_breakdown: [
      { label: subsectionLabels[0] },
      { label: subsectionLabels[1] },
      { label: subsectionLabels[2] },
    ],
  },
  {
    username: 'test-username-3',
    external_user_key: 'EKey3',
    email: 'email-3',
    percent: 0.6,
    section_breakdown: [
      { label: subsectionLabels[0] },
      { label: subsectionLabels[1] },
      { label: subsectionLabels[2] },
    ],
  },
];

const testHeading = 'test-heading-value';

const headings = [
  Headings.totalGrade,
  Headings.username,
  Headings.email,
  Headings.fullName,
  testHeading,
];

describe('useGradebookTableData hook', () => {
  beforeAll(() => {
    mockUseAllGrades = jest.fn();
    mockUseGetHeadings = jest.fn();
  });

  beforeEach(() => {
    mockUseAllGrades.mockReset();
    mockUseGetHeadings.mockReset();
  });
  let hookResult;

  const TestComponent = () => {
    hookResult = hooks.useGradebookTableData();
    return null;
  };

  beforeEach(() => {
    initializeMocks();
    hookResult = null;
    mockUseAllGrades.mockReturnValue([]);
    mockUseGetHeadings.mockReturnValue([]);
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

  it('returns expected structure with grades and headings data', () => {
    mockUseAllGrades.mockReturnValue(allGrades);
    mockUseGetHeadings.mockReturnValue(headings);
    render(<TestComponent />);
    expect(hookResult.columns.length).toBe(headings.length);
    expect(hookResult.columns[0].accessor).toEqual(headings[0]);
    expect(hookResult.data.length).toBe(allGrades.length);
    expect(hookResult.data[0]).toHaveProperty(Headings.username);
    expect(hookResult.grades).toEqual(allGrades);
    expect(hookResult.nullMethod()).toBeNull();
    expect(hookResult.emptyContent).toBe(messages.noResultsFound.defaultMessage);

    expect(mockUseAllGrades).toHaveBeenCalled();
    expect(mockUseGetHeadings).toHaveBeenCalled();
  });
});
