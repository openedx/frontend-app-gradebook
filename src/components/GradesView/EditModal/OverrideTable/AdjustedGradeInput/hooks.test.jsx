import { getLocalizedSlash } from 'i18n/utils';
import { actions, selectors } from 'data/redux/hooks';
import useAdjustedGradeInputData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useEditModalPossibleGrade: jest.fn(),
    },
    app: {
      useModalData: jest.fn(),
    },
  },
  actions: {
    app: {
      useSetModalState: jest.fn(),
    },
  },
}));
jest.mock('i18n/utils', () => ({ getLocalizedSlash: jest.fn() }));

const localizedSlash = 'localized-slash';
getLocalizedSlash.mockReturnValue(localizedSlash);

const possibleGrade = 105;
selectors.root.useEditModalPossibleGrade.mockReturnValue(possibleGrade);
const modalData = { adjustedGradeValue: 70 };
const setModalState = jest.fn();
selectors.app.useModalData.mockReturnValue(modalData);
actions.app.useSetModalState.mockReturnValue(setModalState);

let out;
describe('useAdjustedGradeInputData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useAdjustedGradeInputData();
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.root.useEditModalPossibleGrade).toHaveBeenCalled();
      expect(selectors.app.useModalData).toHaveBeenCalled();
      expect(actions.app.useSetModalState).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    it('forwards adjusted grade value as value from modal data', () => {
      expect(out.value).toEqual(modalData.adjustedGradeValue);
    });
    describe('hintText', () => {
      it('passes an undefined value if possibleGrade is not available', () => {
        selectors.root.useEditModalPossibleGrade.mockReturnValueOnce(undefined);
        out = useAdjustedGradeInputData();
        expect(out.hintText).toEqual(undefined);
      });
      it('passes localized slash and possible grade if available', () => {
        expect(out.hintText).toEqual(` ${localizedSlash} ${possibleGrade}`);
      });
    });
    describe('onChange', () => {
      it('sets modal state with event target value when it is less than possibleGrade', () => {
        const testValue = possibleGrade - 1;
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: testValue });
      });
      it('sets modal state with event target value when it is equal to possibleGrade', () => {
        const testValue = possibleGrade;
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: testValue });
      });
      it('sets modal state to possibleGrade when event target value is greater than possibleGrade', () => {
        const testValue = possibleGrade + 1;
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: possibleGrade });
      });
      it('sets modal state to 0 when event target value is less than 0', () => {
        const testValue = -1;
        out.onChange({ target: { value: testValue } });
        expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: 0 });
      });
    });
  });
});
