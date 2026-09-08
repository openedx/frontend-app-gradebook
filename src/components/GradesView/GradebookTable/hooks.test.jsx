import { renderWithAllProviders } from '@src/testUtils';
import { Headings } from '@src/data/constants/grades';
import { useAllGrades, useGradesHeadings } from '../data/hooks';
import useGradebookTableData from './hooks';
import messages from './messages';

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useAllGrades: jest.fn(),
  useGradesHeadings: jest.fn(),
}));
jest.mock('@src/i18n/utils', () => ({
  ...jest.requireActual('@src/i18n/utils'),
  getLocalizedPercentSign: () => '%',
}));
jest.mock('./Fields', () => ({
  Username: () => null,
  Text: () => null,
}));
jest.mock('./GradeButton', () => () => null);
jest.mock('./LabelReplacements', () => ({
  TotalGradeLabelReplacement: () => null,
  UsernameLabelReplacement: () => null,
  MastersOnlyLabelReplacement: () => null,
}));

// `useGradebookTableData` uses `useIntl` from `@openedx/frontend-base`, which
// requires the full provider tree exposed by `renderWithAllProviders`.
const captureHook = () => {
  let hookResult;
  const Capture = () => {
    hookResult = useGradebookTableData();
    return null;
  };
  renderWithAllProviders(<Capture />);
  return hookResult;
};

const subsectionLabels = ['subsection-1', 'subsection-2'];
const grades = [
  {
    username: 'u1',
    external_user_key: 'ek1',
    email: 'e1',
    percent: 0.9,
    section_breakdown: [{ label: subsectionLabels[0] }, { label: subsectionLabels[1] }],
  },
  {
    username: 'u2',
    external_user_key: 'ek2',
    email: 'e2',
    percent: 0.5,
    section_breakdown: [{ label: subsectionLabels[0] }, { label: subsectionLabels[1] }],
  },
];

const headings = [Headings.totalGrade, Headings.username, Headings.email, 'custom-heading'];

describe('useGradebookTableData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAllGrades.mockReturnValue([]);
    useGradesHeadings.mockReturnValue([]);
  });

  it('returns empty columns/data when there are no grades or headings', () => {
    const out = captureHook();
    expect(out).toEqual({
      columns: [],
      data: [],
      grades: [],
      nullMethod: expect.any(Function),
      emptyContent: messages.noResultsFound.defaultMessage,
    });
  });

  it('nullMethod returns null', () => {
    const out = captureHook();
    expect(out.nullMethod()).toBeNull();
  });

  it('maps each heading into a column with the correct accessor', () => {
    useAllGrades.mockReturnValue(grades);
    useGradesHeadings.mockReturnValue(headings);
    const out = captureHook();
    expect(out.columns).toHaveLength(headings.length);
    out.columns.forEach((column, i) => {
      expect(column.accessor).toBe(headings[i]);
    });
  });

  it('maps each grade row and includes the total-grade + subsection cells', () => {
    useAllGrades.mockReturnValue(grades);
    useGradesHeadings.mockReturnValue(headings);
    const out = captureHook();
    expect(out.data).toHaveLength(grades.length);
    const firstRow = out.data[0];
    expect(firstRow[Headings.totalGrade]).toBe('90%');
    expect(firstRow[subsectionLabels[0]]).toBeDefined();
    expect(firstRow[subsectionLabels[1]]).toBeDefined();
  });
});
