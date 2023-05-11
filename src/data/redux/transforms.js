import { StrictDict } from 'utils';
import selectors from 'data/selectors';

// export const root = StrictDict({});
// export const app = StrictDict({});
export const assignmentTypes = StrictDict({});
export const cohorts = StrictDict({});
export const filters = StrictDict({});
export const grades = StrictDict({
  subsectionGrade: ({ gradeFormat, subsection }) => () => (
    selectors.grades.subsectionGrade[gradeFormat](subsection)
  ),
  roundGrade: selectors.grades.roundGrade,
});

export const roles = StrictDict({
});

export const tracks = StrictDict({
});

export default StrictDict({
  app,
  assignmentTypes,
  cohorts,
  filters,
  grades,
  roles,
  tracks,
  root,
});
