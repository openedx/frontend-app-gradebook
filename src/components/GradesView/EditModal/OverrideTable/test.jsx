import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';

import {
  OverrideTable,
  mapStateToProps,
} from '.';

jest.mock('@edx/paragon', () => ({ DataTable: () => 'DataTable' }));
jest.mock('./ReasonInput', () => 'ReasonInput');
jest.mock('./AdjustedGradeInput', () => 'AdjustedGradeInput');

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      modalState: {
        todaysDate: jest.fn(state => ({ todaysDate: state })),
      },
    },
    grades: {
      hasOverrideErrors: jest.fn(state => ({ hasOverrideErrors: state })),
      gradeOverrides: jest.fn(state => ({ gradeOverrides: state })),
    },
  },
}));

describe('OverrideTable', () => {
  const props = {
    gradeOverrides: [
      {
        date: 'yesterday',
        grader: 'me',
        reason: 'you ate my sandwich',
        adjustedGrade: 0,
      },
      {
        date: 'today',
        grader: 'me',
        reason: 'you brought me a new sandwich',
        adjustedGrade: 20,
      },
    ],
    hide: false,
    todaysDate: 'todaaaaaay',
  };

  describe('Component', () => {
    describe('snapshots', () => {
      it('returns null if hide is true', () => {
        expect(shallow(<OverrideTable {...props} hide />)).toEqual({});
      });
      describe('basic snapshot', () => {
        test('shows a row for each entry and one editable row', () => {
          expect(shallow(<OverrideTable {...props} />)).toMatchSnapshot();
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { I: 'wanna', be: 'the', very: 'best' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    describe('modalState', () => {
      test('hide from grades.hasOverrideErrors', () => {
        expect(mapped.hide).toEqual(selectors.grades.hasOverrideErrors(testState));
      });
      test('gradeOverrides from grades.gradeOverrides', () => {
        expect(mapped.gradeOverrides).toEqual(selectors.grades.gradeOverrides(testState));
      });
      test('todaysData from app.modalState.todaysDate', () => {
        expect(mapped.todaysDate).toEqual(selectors.app.modalState.todaysDate(testState));
      });
    });
  });
});
