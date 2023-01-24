import { StrictDict } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';

const grades = StrictDict({
  useFetchGradesIfAssignmentGradeFiltersSet: actionHook(
    thunkActions.grades.fetchGradesIfAssignmentGradeFiltersSet,
  ),
});

export default StrictDict({
  grades,
});
