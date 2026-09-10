import PropTypes from 'prop-types';

import { Button } from '@openedx/paragon';

import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { subsectionGrade } from '../data/utils';
import { useGradeData } from '../data/hooks';
import * as module from './GradeButton';

export const useGradeButtonData = ({ entry, subsection }) => {
  const { courseId, enabled } = useCourseIdWithGate();
  const areGradesFrozen = useAssignmentTypes(courseId, { enabled }).data?.areGradesFrozen;
  const { gradeFormat } = useGradeData();
  const { setModalStateFromTable: setModalState } = useGradebookUi();
  const label = subsectionGrade[gradeFormat](subsection);

  const onClick = () => {
    setModalState({
      userEntry: entry,
      subsection,
    });
  };

  return {
    areGradesFrozen,
    label,
    onClick,
  };
};

/**
 * GradeButton
 * The button link for a user's grade for a given subseciton.
 * load formatting based on selected grade format, and on click, opens
 * the editModal, loading in the current entry and subsection.
 * @param {object} entry - user's grade entry
 * @param {object} subsection - user's subsection grade from subsection_breakdown
 */
export const GradeButton = ({ entry, subsection }) => {
  const {
    areGradesFrozen,
    label,
    onClick,
  } = module.useGradeButtonData({ entry, subsection });
  return areGradesFrozen
    ? label
    : (
      <Button
        variant="link"
        className="btn-header grade-button"
        onClick={onClick}
      >
        {label}
      </Button>
    );
};
GradeButton.propTypes = {
  subsection: PropTypes.shape({
    attempted: PropTypes.bool,
    percent: PropTypes.number,
    score_possible: PropTypes.number,
    subsection_name: PropTypes.string,
    module_id: PropTypes.string,
  }).isRequired,
  entry: PropTypes.shape({
    user_id: PropTypes.number,
    username: PropTypes.string,
  }).isRequired,
};

export default GradeButton;
