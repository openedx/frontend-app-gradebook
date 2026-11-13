import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';

import useAssignmentGradeFilterData from './hooks';
import messages from '../messages';
import PercentGroup from '../PercentGroup';

export const AssignmentGradeFilter = ({ updateQueryParams }) => {
  const {
    assignmentGradeMin,
    assignmentGradeMax,
    selectedAssignment,
    isApplyDisabled,
    handleSetMax,
    handleSetMin,
    handleSubmit,
  } = useAssignmentGradeFilterData({ updateQueryParams });
  const { formatMessage } = useIntl();
  return (
    <div className="grade-filter-inputs">
      <PercentGroup
        id="assignmentGradeMin"
        label={formatMessage(messages.minGrade)}
        value={assignmentGradeMin}
        max={null}
        disabled={!selectedAssignment}
        onChange={handleSetMin}
      />
      <PercentGroup
        id="assignmentGradeMax"
        label={formatMessage(messages.maxGrade)}
        value={assignmentGradeMax}
        max={null}
        disabled={!selectedAssignment}
        onChange={handleSetMax}
      />
      <div className="grade-filter-action">
        <Button
          type="submit"
          variant="outline-secondary"
          name="assignmentGradeMinMax"
          disabled={isApplyDisabled}
          onClick={handleSubmit}
        >
          {formatMessage(messages.apply)}
        </Button>
      </div>
    </div>
  );
};

AssignmentGradeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentGradeFilter;
