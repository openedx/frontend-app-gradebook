import { StrictDict } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';

const grades = StrictDict({
  useFetchGradesIfAssignmentGradeFiltersSet: actionHook(
    thunkActions.grades.fetchGradesIfAssignmentGradeFiltersSet,
  ),
  useFetchGrades: actionHook(thunkActions.grades.fetchGrades),
  useSubmitImportGradesButtonData: actionHook(thunkActions.grades.submitImportGradesButtonData),
});

export default StrictDict({
  grades,
});
