import { StrictDict } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';

const app = StrictDict({
  filterMenu: {
    useCloseMenu: actionHook(thunkActions.app.filterMenu.close),
    useHandleTransitionEnd: actionHook(thunkActions.app.filterMenu.handleTransitionEnd),
    useToggleMenu: actionHook(thunkActions.app.filterMenu.toggle),
  },
  useSetModalStateFromTable: actionHook(thunkActions.app.setModalStateFromTable),
});

const grades = StrictDict({
  useFetchGradesIfAssignmentGradeFiltersSet: actionHook(
    thunkActions.grades.fetchGradesIfAssignmentGradeFiltersSet,
  ),
  useFetchPrevNextGrades: actionHook(thunkActions.grades.fetchPrevNextGrades),
  useFetchGrades: actionHook(thunkActions.grades.fetchGrades),
  useSubmitImportGradesButtonData: actionHook(thunkActions.grades.submitImportGradesButtonData),
  useUpdateGrades: actionHook(thunkActions.grades.updateGrades),
});

export default StrictDict({
  app,
  grades,
});
