import { selectors, actions, thunkActions } from 'data/redux/hooks';

import useEditModalData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: { useCloseModal: jest.fn() },
    grades: { useDoneViewingAssignment: jest.fn() },
  },
  selectors: {
    app: { useModalData: jest.fn() },
    grades: { useGradeData: jest.fn() },
  },
  thunkActions: {
    grades: { useUpdateGrades: jest.fn() },
  },
}));

const closeModal = jest.fn();
const doneViewingAssignment = jest.fn();
const updateGrades = jest.fn();
actions.app.useCloseModal.mockReturnValue(closeModal);
actions.grades.useDoneViewingAssignment.mockReturnValue(doneViewingAssignment);
thunkActions.grades.useUpdateGrades.mockReturnValue(updateGrades);

const gradeData = { gradeOverridHistoryError: 'test-error' };
const modalData = { open: true };
selectors.app.useModalData.mockReturnValue(modalData);
selectors.grades.useGradeData.mockReturnValue(gradeData);

let out;
describe('useEditModalData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useEditModalData();
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.grades.useGradeData).toHaveBeenCalled();
      expect(selectors.app.useModalData).toHaveBeenCalled();
      expect(actions.app.useCloseModal).toHaveBeenCalled();
      expect(actions.grades.useDoneViewingAssignment).toHaveBeenCalled();
      expect(thunkActions.grades.useUpdateGrades).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    it('forwards error from gradeData.gradeOverrideHistoryError', () => {
      expect(out.error).toEqual(gradeData.gradeOverrideHistoryError);
    });
    it('forwards isOpen from modalData.open', () => {
      expect(out.isOpen).toEqual(modalData.open);
    });
    describe('handleAdjustedGradeClick', () => {
      it('updates grades, calls doneViewingAssignment and closeModal', () => {
        out.handleAdjustedGradeClick();
        expect(updateGrades).toHaveBeenCalled();
        expect(doneViewingAssignment).toHaveBeenCalled();
        expect(closeModal).toHaveBeenCalled();
      });
    });
    test('onClose calls doneViewingAssignment and closeModal', () => {
      out.onClose();
      expect(doneViewingAssignment).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalled();
      expect(updateGrades).not.toHaveBeenCalled();
    });
  });
});
