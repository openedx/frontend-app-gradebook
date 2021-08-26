import initialFilters from '../constants/filters';
import { views } from '../constants/app';
import { formatDateForDisplay } from '../actions/utils';
import actions from '../actions/app';
import filterActions from '../actions/filters';
import gradesActions from '../actions/grades';

const initialState = {
  courseId: '',
  activeView: views.grades,
  filters: {
    assignmentGradeMax: initialFilters.assignmentGradeMax,
    assignmentGradeMin: initialFilters.assignmentGradeMin,
    courseGradeMax: initialFilters.courseGradeMax,
    courseGradeMin: initialFilters.courseGradeMin,
  },
  modalState: {
    open: false,
    adjustedGradePossible: '',
    adjustedGradeValue: 0,
    assignmentName: '',
    reasonForChange: '',
    todaysDate: '',
    updateModuleId: null,
    updateUserId: null,
    updateUserName: null,
  },
  filterMenu: {
    open: false,
    transitioning: false,
  },
  showImportSuccessToast: false,
  searchValue: '',
};

const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.closeModal.toString():
      return { ...state, modalState: { ...initialState.modalState } };
    case actions.setCourseId.toString():
      return { ...state, courseId: payload };
    case actions.filterMenu.startTransition.toString():
      return {
        ...state,
        filterMenu: { ...state.filterMenu, transitioning: true },
      };
    case actions.filterMenu.endTransition.toString():
      return {
        ...state,
        filterMenu: { ...state.filterMenu, transitioning: false },
      };
    case actions.filterMenu.toggle.toString():
      return {
        ...state,
        filterMenu: { ...state.filterMenu, open: !state.filterMenu.open },
      };
    case actions.setLocalFilter.toString():
      return {
        ...state,
        filters: { ...state.filters, ...payload },
      };
    case actions.setModalState.toString():
      return {
        ...state,
        modalState: { ...state.modalState, ...payload },
      };
    case actions.setModalStateFromTable.toString(): {
      const { subsection, userEntry } = payload;
      return {
        ...state,
        modalState: {
          adjustedGradeValue: '',
          open: true,
          reasonForChange: '',
          todaysDate: formatDateForDisplay(new Date()),

          adjustedGradePossible: subsection.attempted ? subsection.score_possible : '',
          assignmentName: `${subsection.subsection_name}`,
          updateModuleId: subsection.module_id,
          updateUserId: userEntry.user_id,
          updateUserName: userEntry.username,
        },
      };
    }
    case actions.setSearchValue.toString():
      return { ...state, searchValue: payload };
    case actions.setShowImportSuccessToast.toString():
      return { ...state, showImportSuccessToast: payload };
    case actions.setView.toString():
      return { ...state, activeView: payload };
    // initialize the filter fields that are locally stored
    case filterActions.initialize.toString():
      return {
        ...state,
        filters: {
          assignmentGradeMax: payload.assignmentGradeMax,
          assignmentGradeMin: payload.assignmentGradeMin,
          courseGradeMax: payload.courseGradeMax,
          courseGradeMin: payload.courseGradeMin,
        },
      };
    // Reset only the filter fields that are stored locally
    case filterActions.reset.toString(): {
      return payload.filter(
        (filterName) => initialState.filters[filterName] !== undefined,
      ).reduce((obj, filterName) => ({
        ...obj,
        filters: {
          ...obj.filters,
          [filterName]: initialFilters[filterName],
        },
      }), { ...state });
    }
    case gradesActions.csvUpload.finished.toString():
      return { ...state, showImportSuccessToast: true };
    default:
      return state;
  }
};

export { initialState };
export default app;
