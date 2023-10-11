import { shallow } from 'enzyme';

import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';

import { getLocalizedPercentSign } from 'i18n/utils';
import { selectors } from 'data/redux/hooks';
import transforms from 'data/redux/transforms';
import { Headings } from 'data/constants/grades';
import LabelReplacements from './LabelReplacements';
import Fields from './Fields';
import GradeButton from './GradeButton';

import messages from './messages';

import useGradebookTableData from './hooks';

jest.mock('i18n/utils', () => ({
  getLocalizedPercentSign: () => '%',
}));
jest.mock('./GradeButton', () => 'GradeButton');
jest.mock('./Fields', () => jest.requireActual('testUtils').mockNestedComponents({
  Username: 'Fields.Username',
  Text: 'Fields.Text',
}));
jest.mock('./LabelReplacements', () => jest.requireActual('testUtils').mockNestedComponents({
  TotalGradeLabelReplacement: 'LabelReplacements.TotalGradeLabelReplacement',
  UsernameLabelReplacement: 'LabelReplacements.UsernameLabelReplacement',
  MastersOnlyLabelReplacement: 'LabelReplacements.MastersOnlyLabelReplacement',
}));

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: { useAllGrades: jest.fn() },
    root: { useGetHeadings: jest.fn() },
  },
}));
jest.mock('data/redux/transforms', () => ({
  grades: { roundGrade: jest.fn() },
}));

const roundGrade = grade => grade * 20;
transforms.grades.roundGrade.mockImplementation(roundGrade);

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
selectors.grades.useAllGrades.mockReturnValue(allGrades);
selectors.root.useGetHeadings.mockReturnValue(headings);

let out;
describe('useGradebookTableData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useGradebookTableData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.grades.useAllGrades).toHaveBeenCalled();
      expect(selectors.root.useGetHeadings).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('columns', () => {
      test('total grade heading produces TotalGradeLabelReplacement label', () => {
        const { Header, accessor } = out.columns[0];
        expect(accessor).toEqual(headings[0]);
        expect(shallow(Header)).toMatchObject(
          shallow(<LabelReplacements.TotalGradeLabelReplacement />),
        );
      });
      test('username heading produces UsernameLabelReplacement', () => {
        const { Header, accessor } = out.columns[1];
        expect(accessor).toEqual(headings[1]);
        expect(shallow(Header)).toMatchObject(
          shallow(<LabelReplacements.UsernameLabelReplacement />),
        );
      });
      test('email heading replaces with email heading message', () => {
        const { Header, accessor } = out.columns[2];
        expect(accessor).toEqual(headings[2]);
        expect(shallow(Header)).toMatchObject(
          shallow(<LabelReplacements.MastersOnlyLabelReplacement {...messages.emailHeading} />),
        );
      });
      test('fullName heading replaces with fullName heading message', () => {
        const { Header, accessor } = out.columns[3];
        expect(accessor).toEqual(headings[3]);
        expect(shallow(Header)).toMatchObject(
          shallow(<LabelReplacements.MastersOnlyLabelReplacement {...messages.fullNameHeading} />),
        );
      });
      test('other headings are passed through', () => {
        const { Header, accessor } = out.columns[4];
        expect(accessor).toEqual(headings[4]);
        expect(Header).toEqual(headings[4]);
      });
    });
    describe('data', () => {
      test('username field', () => {
        allGrades.forEach((entry, index) => {
          expect(out.data[index][Headings.username]).toMatchObject(
            <Fields.Username username={entry.username} userKey={entry.external_user_key} />,
          );
        });
      });
      test('email field', () => {
        allGrades.forEach((entry, index) => {
          expect(out.data[index][Headings.email]).toMatchObject(
            <Fields.Text value={entry.email} />,
          );
        });
      });
      test('totalGrade field', () => {
        allGrades.forEach((entry, index) => {
          expect(out.data[index][Headings.totalGrade]).toEqual(
            `${roundGrade(entry.percent * 100)}${getLocalizedPercentSign()}`,
          );
        });
      });
      test('section breakdown', () => {
        allGrades.forEach((entry, gradeIndex) => {
          subsectionLabels.forEach((label, labelIndex) => {
            expect(out.data[gradeIndex][label]).toMatchObject(
              <GradeButton entry={entry} subsection={entry.section_breakdown[labelIndex]} />,
            );
          });
        });
      });
    });
    it('forwards grades from redux', () => {
      expect(out.grades).toEqual(allGrades);
    });
    test('nullMethod returns null', () => {
      expect(out.nullMethod()).toEqual(null);
    });
    test('emptyContent', () => {
      expect(out.emptyContent).toEqual(formatMessage(messages.noResultsFound));
    });
  });
});
