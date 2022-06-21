import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import {
  EditModal,
  mapDispatchToProps,
  mapStateToProps,
} from '.';

jest.mock('./OverrideTable', () => 'OverrideTable');
jest.mock('./ModalHeaders', () => 'ModalHeaders');
jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
  Modal: () => 'Modal',
  Alert: () => 'Alert',
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: { closeModal: jest.fn() },
    grades: { doneViewingAssignment: jest.fn() },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    grades: { updateGrades: jest.fn() },
  },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      modalState: {
        open: jest.fn(state => ({ isModalOpen: state })),
      },
    },
    grades: {
      gradeOverrideHistoryError: jest.fn(state => ({ overrideHistoryError: state })),
    },
  },
}));
describe('EditMoal', () => {
  let props;
  beforeEach(() => {
    props = {
      gradeOverrideHistoryError: 'Weve been trying to contact you regarding...',
      open: true,
      closeModal: jest.fn(),
      doneViewingAssignment: jest.fn(),
      updateGrades: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      let el;
      beforeEach(() => {
        el = shallow(<EditModal {...props} />);
      });
      describe('closeAssignmentModal', () => {
        it('calls props.doneViewingAssignment and props.closeModal', () => {
          el.instance().closeAssignmentModal();
          expect(props.doneViewingAssignment).toHaveBeenCalledWith();
          expect(props.closeModal).toHaveBeenCalledWith();
        });
      });
      describe('handleAdjustedGradeClick', () => {
        it('calls props.updateGardes and this.closeAssignmentModal', () => {
          el.instance().closeAssignmentModal = jest.fn();
          el.instance().handleAdjustedGradeClick();
          expect(props.updateGrades).toHaveBeenCalledWith();
          expect(el.instance().closeAssignmentModal).toHaveBeenCalledWith();
        });
      });
    });
    describe('snapshots', () => {
      let el;
      beforeEach(() => {
        el = shallow(<EditModal {...props} />);
        el.instance().closeAssignmentModal = jest.fn().mockName('this.closeAssignmentModal');
        el.instance().handleAdjustedGradeClick = jest.fn().mockName(
          'this.handleAdjustedGradeClick',
        );
      });
      describe('gradeOverrideHistoryError is and empty and open is true', () => {
        test('modal open and StatusAlert showing', () => {
          expect(el.instance().render()).toMatchSnapshot();
        });
      });
      describe('gradeOverrideHistoryError is empty and open is false', () => {
        test('modal closed and StatusAlert closed', () => {
          el.setProps({ open: false, gradeOverrideHistoryError: '' });
          expect(el.instance().render()).toMatchSnapshot();
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { martha: 'why did you say that name?!' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('gradeOverrideHistoryError from grades.gradeOverrideHistoryError', () => {
      expect(
        mapped.gradeOverrideHistoryError,
      ).toEqual(selectors.grades.gradeOverrideHistoryError(testState));
    });
    test('open from app.modalState.open', () => {
      expect(mapped.open).toEqual(selectors.app.modalState.open(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('closeModal from actions.app.closeModal', () => {
      expect(mapDispatchToProps.closeModal).toEqual(actions.app.closeModal);
    });
    test('doneViewingAssignemtn from actions.grades.doneViewingAssignment', () => {
      expect(
        mapDispatchToProps.doneViewingAssignment,
      ).toEqual(actions.grades.doneViewingAssignment);
    });
    test('updateGrades from thunkActions.grades.updateGrades', () => {
      expect(mapDispatchToProps.updateGrades).toEqual(thunkActions.grades.updateGrades);
    });
  });
});
