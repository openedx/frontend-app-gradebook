import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradeOverrideData } from '@src/components/GradesView/data/hooks';
import OverrideTable from '.';
import messages from './messages';

jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useGradeOverrideData: jest.fn(),
}));
jest.mock('./AdjustedGradeInput', () => () => <div data-testid="adjusted-grade-input" />);
jest.mock('./ReasonInput', () => () => <div data-testid="reason-input" />);

const overrideHistory = [
  { date: '2025-01-01', grader: 'grader-1', reason: 'reason-1', adjustedGrade: '80' },
  { date: '2025-01-02', grader: 'grader-2', reason: 'reason-2', adjustedGrade: '90' },
];

describe('OverrideTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when hasOverrideErrors is truthy', () => {
    useGradeOverrideData.mockReturnValue({
      gradeOverrideHistoryResults: overrideHistory,
      hasOverrideErrors: true,
    });
    const { container } = renderWithAllProviders(<OverrideTable />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the column headers and the edit-row inputs', () => {
    useGradeOverrideData.mockReturnValue({
      gradeOverrideHistoryResults: [],
      hasOverrideErrors: false,
    });
    renderWithAllProviders(<OverrideTable />);
    expect(screen.getByText(messages.dateHeader.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.graderHeader.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reasonHeader.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.adjustedGradeHeader.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId('adjusted-grade-input')).toBeInTheDocument();
    expect(screen.getByTestId('reason-input')).toBeInTheDocument();
  });

  it('renders one row per override entry (plus the edit row)', () => {
    useGradeOverrideData.mockReturnValue({
      gradeOverrideHistoryResults: overrideHistory,
      hasOverrideErrors: false,
    });
    renderWithAllProviders(<OverrideTable />);
    expect(screen.getByText('grader-1')).toBeInTheDocument();
    expect(screen.getByText('grader-2')).toBeInTheDocument();
  });
});
