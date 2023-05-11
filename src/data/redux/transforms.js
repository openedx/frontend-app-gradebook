import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const grades = StrictDict({
  subsectionGrade: ({ gradeFormat, subsection }) => () => (
    selectors.grades.subsectionGrade[gradeFormat](subsection)
  ),
  roundGrade: selectors.grades.roundGrade,
});

export default StrictDict({
  grades,
});
