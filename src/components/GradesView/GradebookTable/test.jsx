import React from 'react';
import { shallow } from 'enzyme';

import { Table } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import { Headings } from 'data/constants/grades';
import LabelReplacements from './LabelReplacements';
import Fields from './Fields';
import messages from './messages';
import { GradebookTable, mapStateToProps } from '.';

jest.mock('@edx/paragon', () => ({
  Table: () => 'Table',
}));
jest.mock('./Fields', () => ({
  __esModule: true,
  default: {
    Username: () => 'Fields.Username',
    Email: () => 'Fields.Email',
  },
}));
jest.mock('./LabelReplacements', () => ({
  __esModule: true,
  default: {
    TotalGradeLabelReplacement: () => 'TotalGradeLabelReplacement',
    UsernameLabelReplacement: () => 'UsernameLabelReplacement',
  },
}));
jest.mock('./GradeButton', () => 'GradeButton');
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      roundGrade: jest.fn(grade => `roundedGrade: ${grade}`),
      allGrades: jest.fn(state => ({ allGrades: state })),
    },
    root: {
      getHeadings: jest.fn(state => ({ getHeadings: state })),
    },
  },
}));
describe('GradebookTable', () => {
  describe('component', () => {
    let el;
    const fields = { field1: 'field1', field2: 'field2' };
    const props = {
      grades: [
        {
          percent: 1,
          section_breakdown: [
            { label: fields.field1, percent: 1.2 },
            { label: fields.field2, percent: 2.3 },
          ],
        },
        {
          percent: 2,
          section_breakdown: [
            { label: fields.field1, percent: 1.2 },
            { label: fields.field2, percent: 2.3 },
          ],
        },
        {
          percent: 3,
          section_breakdown: [
            { label: fields.field1, percent: 1.2 },
            { label: fields.field2, percent: 2.3 },
          ],
        },
      ],
      headings: [
        Headings.username,
        Headings.email,
        fields.field1,
        fields.field2,
        Headings.totalGrade,
      ],
    };
    test('snapshot - fields1 and 2 between email and totalGrade, mocked rows', () => {
      el = shallow(<GradebookTable {...props} />);
      el.instance().mapRows = (entry) => `mappedRow: ${entry.percent}`;
      expect(el.instance().render()).toMatchSnapshot();
    });
    describe('table columns (mapHeaders)', () => {
      let headings;
      beforeEach(() => {
        el = shallow(<GradebookTable {...props} />);
        headings = el.find(Table).props().columns;
      });
      test('username sets key and replaces label with component', () => {
        const heading = headings[0];
        expect(heading.key).toEqual(Headings.username);
        expect(heading.label.type).toEqual(LabelReplacements.UsernameLabelReplacement);
      });
      test('email sets key and label from header', () => {
        const heading = headings[1];
        expect(heading.key).toEqual(Headings.email);
        expect(heading.label).toEqual(<FormattedMessage {...messages.emailHeading} />);
      });
      test('subsections set key and label from header', () => {
        expect(headings[2]).toEqual({ key: fields.field1, label: fields.field1 });
        expect(headings[3]).toEqual({ key: fields.field2, label: fields.field2 });
      });
      test('totalGrade sets key and replaces label with component', () => {
        const heading = headings[4];
        expect(heading.key).toEqual(Headings.totalGrade);
        expect(heading.label.type).toEqual(LabelReplacements.TotalGradeLabelReplacement);
      });
    });
    describe('table data (mapRows)', () => {
      let rows;
      beforeEach(() => {
        el = shallow(<GradebookTable {...props} />);
        rows = el.find(Table).props().data;
      });
      describe.each([0, 1, 2])('gradeEntry($percent)', (gradeIndex) => {
        let row;
        const entry = props.grades[gradeIndex];
        beforeEach(() => {
          row = rows[gradeIndex];
        });
        test('username set to Username Field', () => {
          const field = row[Headings.username];
          expect(field.type).toEqual(Fields.Username);
          expect(field.props).toEqual({
            username: entry.username,
            userKey: entry.external_user_key,
          });
        });
        test('email set to Email Field', () => {
          const field = row[Headings.email];
          expect(field.type).toEqual(Fields.Email);
          expect(field.props).toEqual({ email: entry.email });
        });
        test('totalGrade set to rounded percent grade * 100', () => {
          expect(
            row[Headings.totalGrade],
          ).toEqual(`${selectors.grades.roundGrade(entry.percent * 100)}%`);
        });
        test('subsections loaded as GradeButtons', () => {
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = {
      where: 'did',
      all: 'of',
      these: 'bananas',
      come: 'from?',
    };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('grades from grades.allGrades', () => {
      expect(mapped.grades).toEqual(selectors.grades.allGrades(testState));
    });
    test('headings from root.getHeadings', () => {
      expect(mapped.headings).toEqual(selectors.root.getHeadings(testState));
    });
  });
});
