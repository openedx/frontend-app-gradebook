import { StrictDict } from 'utils';
import { modalFieldKeys, localFilterKeys } from 'data/constants/app';
import { createActionFactory } from './utils';

export const dataKey = 'app';
const createAction = createActionFactory(dataKey);

const closeModal = createAction('closeModal');
/**
 * setCourseId(courseId)
 * loads courseID into local app state
 * @param {string} courseId - course ID from app context
 */
const setCourseId = createAction('setCourseId');
/**
  * setModalStateFromTable({ userEntry, subsection })
  * sets modalState
  * */
const setModalStateFromTable = createAction('setModalStateFromTable');
/**
 * setSearchValue(searchValue)
 * sets searchValue in local state
 * @param {string} searchValue - search input text
 */
const setSearchValue = createAction('setSearchValue');

const filterReducer = (payload) => (obj, key) => (
  (payload[key] !== undefined) ? { ...obj, [key]: payload[key] } : obj
);

/**
 * setLocalFilter(filterObject)
 * sets a number of localFilterKey fields on localFilters
 * @param {object} filterObject - an object of filter values
 */
const setLocalFilter = createAction('setLocalFilter', (filterObject) => ({
  payload: Object.keys(localFilterKeys).reduce(filterReducer(filterObject), {}),
}));

/**
 * setModalState(modalState)
 * sets a number of modalFieldKey fields on modalState
 * @param {object} modalState - an object of modal state values
 */
const setModalState = createAction('setModalState', (modalState) => ({
  payload: Object.keys(modalFieldKeys).reduce(filterReducer(modalState), {}),
}));

export default StrictDict({
  closeModal,
  setCourseId,
  setModalState,
  setSearchValue,
  setLocalFilter,
  setModalStateFromTable,
});
