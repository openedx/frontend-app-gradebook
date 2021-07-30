// import * in order to mock in-file references
import * as selectors from './app';
// import default export in order to test simpleSelectors not exported individually
import exportedSelectors from './app';

const testState = {
  app: {
    courseId: 'Just',
    filters: {
      assignmentGradeMax: 'keep',
      assignmentGradeMin: 'swiming',
      courseGradeMax: 'just',
      courseGradeMin: 'keep',
    },
    modalState: {
      open: 'swimming',
      adjustedGradePossible: 'what',
      adjustedGradeValue: 'do',
      assignmentName: 'we',
      reasonForChange: 'do',
      todaysDate: 'we',
      updateModuleId: 'swim',
      updateUserId: 'swim',
      updateUsername: 'swim',
    },
    searchValue: 'blub blub',
  },
};

const testVal = 'some Test Value';

describe('app selectors', () => {
  describe('assignmentGradeLimits', () => {
    it('loads assignmentGradeMin/Max from filters', () => {
      expect(exportedSelectors.assignmentGradeLimits(testState)).toEqual({
        assignmentGradeMax: testState.app.filters.assignmentGradeMax,
        assignmentGradeMin: testState.app.filters.assignmentGradeMin,
      });
    });
  });
  describe('courseGradeFilterValidity', () => {
    it('returns true iff the value is between 0 and 100 (inclusive)', () => {
      const testSelector = (courseGradeMax, isMaxValid, courseGradeMin, isMinValid) => {
        expect(selectors.courseGradeFilterValidity({
          ...testState,
          app: {
            ...testState.app,
            filters: { ...testState.filters, courseGradeMax, courseGradeMin },
          },
        })).toEqual({ isMaxValid, isMinValid });
      };
      testSelector(-1, false, 0, true);
      testSelector(0, true, -1, false);
      testSelector(100, true, 101, false);
      testSelector(101, false, 100, true);
    });
  });
  describe('courseGradeLimits', () => {
    it('loads courseGradeMin/Max from filters', () => {
      expect(exportedSelectors.courseGradeLimits(testState)).toEqual({
        courseGradeMax: testState.app.filters.courseGradeMax,
        courseGradeMin: testState.app.filters.courseGradeMin,
      });
    });
  });
  describe('editUpdateData', () => {
    it('loads grade, usage_id, and user_id from modalState', () => {
      expect(exportedSelectors.editUpdateData(testState)).toEqual([{
        grade: {
          comment: testState.app.modalState.reasonForChange,
          earned_graded_override: testState.app.modalState.adjustedGradeValue,
        },
        usage_id: testState.app.modalState.updateModuleId,
        user_id: testState.app.modalState.updateUserId,
      }]);
    });
  });
  describe('areCourseGradeFiltersValid', () => {
    const mockValidity = (isMinValid, isMaxValid) => {
      selectors.courseGradeFilterValidity = jest.fn(() => ({
        isMinValid,
        isMaxValid,
      }));
    };
    it('returns true iff courseGrade filters are both valid', () => {
      const old = selectors.courseGradeFilterValidity;
      mockValidity(false, true);
      expect(exportedSelectors.areCourseGradeFiltersValid(testState)).toEqual(false);
      mockValidity(true, false);
      expect(exportedSelectors.areCourseGradeFiltersValid(testState)).toEqual(false);
      mockValidity(true, true);
      expect(exportedSelectors.areCourseGradeFiltersValid(testState)).toEqual(true);
      selectors.courseGradeFilterValidity = old;
    });
  });

  describe('filterMenu', () => {
    describe('isClosed', () => {
      const testSelector = (open, transitioning, expected) => {
        expect(exportedSelectors.filterMenu.isClosed({
          app: { filterMenu: { open, transitioning } },
        })).toEqual(expected);
      };
      it('returns true if filterMenu is !open and !transitioning', () => {
        testSelector(false, false, true);
      });
      it('returns false if filterMenu is not (!open and !transitioning)', () => {
        testSelector(true, false, false);
        testSelector(false, true, false);
        testSelector(true, true, false);
      });
    });
    describe('isOpening', () => {
      const testSelector = (open, transitioning, expected) => {
        expect(exportedSelectors.filterMenu.isOpening({
          app: { filterMenu: { open, transitioning } },
        })).toEqual(expected);
      };
      it('returns true if filter menu is transitioning AND open', () => {
        testSelector(true, true, true);
      });
      it('returns true if filter menu is not (transitioning AND open)', () => {
        testSelector(false, false, false);
        testSelector(true, false, false);
        testSelector(false, true, false);
      });
    });
    describe('simpleSelectors', () => {
      const testFilterMenuSelector = (key) => {
        test(key, () => {
          expect(
            exportedSelectors.filterMenu[key]({ app: { filterMenu: { [key]: testVal } } }),
          ).toEqual(testVal);
        });
      };
      testFilterMenuSelector('open');
      testFilterMenuSelector('transitioning');
    });
  });
  describe('modalSelectors', () => {
    const testModalSelector = (key) => {
      test(key, () => {
        expect(
          exportedSelectors.modalState[key]({ app: { modalState: { [key]: testVal } } }),
        ).toEqual(testVal);
      });
    };
    testModalSelector('assignmentName');
    testModalSelector('adjustedGradePossible');
    testModalSelector('adjustedGradeValue');
    testModalSelector('open');
    testModalSelector('reasonForChange');
    testModalSelector('todaysDate');
    testModalSelector('updateUserName');
  });
  describe('simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      test(key, () => {
        expect(exportedSelectors[key]({ app: { [key]: testVal } })).toEqual(testVal);
      });
    };
    testSimpleSelector('activeView');
    testSimpleSelector('courseId');
    testSimpleSelector('filters');
    testSimpleSelector('searchValue');
    testSimpleSelector('showImportSuccessToast');
  });
});
