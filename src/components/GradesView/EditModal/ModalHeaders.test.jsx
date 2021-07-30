import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';

import {
  ModalHeaders,
  mapStateToProps,
} from './ModalHeaders';

jest.mock('./HistoryHeader', () => 'HistoryHeader');

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      editUpdateData: jest.fn(state => ({ editUpdateData: state })),
      modalState: {
        assignmentName: jest.fn(state => ({ assignmentName: state })),
        updateUserName: jest.fn(state => ({ updateUserName: state })),
      },
    },
    grades: {
      gradeOverrideCurrentEarnedGradedOverride: jest.fn(state => ({ currentGrade: state })),
      gradeOriginalEarnedGraded: jest.fn(state => ({ originalGrade: state })),
    },
  },
}));
describe('ModalHeaders', () => {
  let el;
  const props = {
    currentGrade: 2,
    originalGrade: 20,
    modalState: {
      assignmentName: 'Qwerty',
      updateUserName: 'Uiop',
    },
  };

  describe('Component', () => {
    describe('snapshots', () => {
      beforeEach(() => {
      });
      describe('gradeOverrideHistoryError is and empty and open is true', () => {
        test('modal open and StatusAlert showing', () => {
          el = shallow(<ModalHeaders {...props} />);
          expect(el).toMatchSnapshot();
        });
      });
      describe('gradeOverrideHistoryError is empty and open is false', () => {
        test('modal closed and StatusAlert closed', () => {
          el = shallow(
            <ModalHeaders {...props} open={false} gradeOverrideHistoryError="" />,
          );
          expect(el).toMatchSnapshot();
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { he: 'lives in a', pineapple: 'under the sea' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    describe('modalState', () => {
      test('assignmentName from app.modalState.assignmentName', () => {
        expect(
          mapped.modalState.assignmentName,
        ).toEqual(selectors.app.modalState.assignmentName(testState));
      });
      test('updateUserName from app.modalState.updateUserName', () => {
        expect(
          mapped.modalState.updateUserName,
        ).toEqual(selectors.app.modalState.updateUserName(testState));
      });
    });
    describe('originalGrade', () => {
      test('from grades.gradeOverrideCurrentEarnedGradedOverride', () => {
        expect(mapped.currentGrade).toEqual(
          selectors.grades.gradeOverrideCurrentEarnedGradedOverride(testState),
        );
      });
    });
    describe('originalGrade', () => {
      test('from grades.gradeOriginalEarnedGrades', () => {
        expect(mapped.originalGrade).toEqual(
          selectors.grades.gradeOriginalEarnedGraded(testState),
        );
      });
    });
  });
});
