/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import simpleSelectorFactory from '../utils';
import * as module from './app';
import { minGrade, maxGrade } from './grades';

/**
 * assignmentGradeFilterValidity(state)
 * returns { isMaxValid, isMinValid } with each assignment grade limit, verifying they
 * are between minGrade and maxGrade (0, 100).
 * @param {object} state - redux state
 * @return {object} - { isMaxValid, isMinValid, isMinLessMaxValid }
 */
export const assignmentGradeFilterValidity = ({ app: { filters } }) => {
  const isFilterValid = (value) => {
    const intValue = parseInt(value, 10);
    return intValue >= minGrade && intValue <= maxGrade;
  };
  return {
    isMaxValid: isFilterValid(filters.assignmentGradeMax),
    isMinValid: isFilterValid(filters.assignmentGradeMin),
    isMinLessMaxValid: Number(filters.assignmentGradeMin) <= Number(filters.assignmentGradeMax),
  };
};

/**
 * assignmentGradeLimits(state)
 * returns an object of local assignmentGradeMin/Max
 * @param {object} state - redux state
 * @return {object} - { assignmentGradeMin, assignmentGradeMax }
 */
const assignmentGradeLimits = (
  { app: { filters: { assignmentGradeMin, assignmentGradeMax } } },
) => ({ assignmentGradeMin, assignmentGradeMax });

/**
 * courseGradeFilterValidity(state)
 * returns { isMaxValid, isMinValid } with each course grade limit, verifying they
 * are between minGrade and maxGrade (0, 100).
 * @param {object} state - redux state
 * @return {object} - { isMaxValid, isMinValid }
 */
export const courseGradeFilterValidity = ({ app: { filters } }) => {
  const isFilterValid = (value) => {
    const intValue = parseInt(value, 10);
    return intValue >= minGrade && intValue <= maxGrade;
  };
  return {
    isMaxValid: isFilterValid(filters.courseGradeMax),
    isMinValid: isFilterValid(filters.courseGradeMin),
    isMinLessMaxValid: Number(filters.courseGradeMin) <= Number(filters.courseGradeMax),
  };
};

/**
 * courseGradeLimits(state)
 * returns an object of local courseGradeMin/Max
 * @param {object} state - redux state
 * @return {object} - { courseGradeMin, courseGradeMax }
 */
const courseGradeLimits = (
  { app: { filters: { courseGradeMin, courseGradeMax } } },
) => ({ courseGradeMin, courseGradeMax });

/**
 * editUpdateDate(state)
 * builds object for update api call from edit modal.
 * @param {object} state - redux state
 * @return {object} - object to pass as update date to updateGrades to apply editModal changes
 */
const editUpdateData = ({ app: { modalState } }) => ([{
  grade: {
    comment: modalState.reasonForChange,
    earned_graded_override: modalState.adjustedGradeValue,
  },
  usage_id: modalState.updateModuleId,
  user_id: modalState.updateUserId,
}]);

/**
 * areCourseGradeFiltersValid(state)
 * returns true iff both min and max course grade filters are valid (within bounds)
 * @param {object} state - redux state
 * @return {bool} - are both filters valid?
 */
const areCourseGradeFiltersValid = (state) => {
  const validity = module.courseGradeFilterValidity(state);
  return validity.isMinValid && validity.isMaxValid && validity.isMinLessMaxValid;
};

/**
 * areAssignmentGradeFiltersValid(state)
 * returns true iff both min and max assignment grade filters are valid (within bounds)
 * @param {object} state - redux state
 * @return {bool} - are both filters valid?
 */
const areAssignmentGradeFiltersValid = (state) => {
  const validity = module.assignmentGradeFilterValidity(state);
  return validity.isMinValid && validity.isMaxValid && validity.isMinLessMaxValid;
};

const isFilterMenuClosed = ({ app: { filterMenu } }) => (
  !filterMenu.open && !filterMenu.transitioning
);

const isFilterMenuOpening = ({ app: { filterMenu } }) => (
  filterMenu.transitioning && filterMenu.open
);

const modalSelectors = simpleSelectorFactory(
  ({ app: { modalState } }) => modalState,
  [
    'assignmentName',
    'adjustedGradePossible',
    'adjustedGradeValue',
    'open',
    'reasonForChange',
    'todaysDate',
    'updateUserName',
  ],
);

const modalData = ({ app: { modalState } }) => ({
  assignmentName: modalState.assignmentName,
  adjustedGradePossible: modalState.adjustedGradePossible,
  adjustedGradeValue: modalState.adjustedGradeValue,
  open: modalState.open,
  reasonForChange: modalState.reasonForChange,
  todaysDate: modalState.todaysDate,
  updateUserName: modalState.updateUserName,
});

const filterMenuSelectors = simpleSelectorFactory(
  ({ app: { filterMenu } }) => filterMenu,
  ['open', 'transitioning'],
);

const simpleSelectors = simpleSelectorFactory(
  ({ app }) => app,
  [
    'activeView',
    'courseId',
    'filters',
    'searchValue',
    'showImportSuccessToast',
  ],
);

export default StrictDict({
  areCourseGradeFiltersValid,
  areAssignmentGradeFiltersValid,
  assignmentGradeLimits,
  courseGradeFilterValidity,
  assignmentGradeFilterValidity,
  courseGradeLimits,
  editUpdateData,
  isFilterMenuClosed,
  isFilterMenuOpening,
  ...simpleSelectors,
  modalState: StrictDict(modalSelectors),
  modalData,
  filterMenu: StrictDict({
    ...filterMenuSelectors,
    isClosed: isFilterMenuClosed,
    isOpening: isFilterMenuOpening,
  }),
});
