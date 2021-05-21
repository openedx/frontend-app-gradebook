import { StrictDict } from 'utils';

const areGradesFrozen = ({ assignmentTypes }) => assignmentTypes.areGradesFrozen;
const allAssignmentTypes = ({ assignmentTypes }) => assignmentTypes.results;

export default StrictDict({
  areGradesFrozen,
  allAssignmentTypes,
});
