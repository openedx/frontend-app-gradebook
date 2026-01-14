import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import useAssignmentGradeFilterData from './hooks';
import messages from '../messages';
import PercentGroup from '../PercentGroup';

export const AssignmentGradeFilter = ({ updateQueryParams }) => {
  const {
    assignmentGradeMin,
    assignmentGradeMax,
    selectedAssignment,
    isDisabled,
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
        disabled={!selectedAssignment}
        onChange={handleSetMin}
      />
      <PercentGroup
        id="assignmentGradeMax"
        label={formatMessage(messages.maxGrade)}
        value={assignmentGradeMax}
        disabled={!selectedAssignment}
        onChange={handleSetMax}
      />
      <div className="grade-filter-action">
        <Button
          type="submit"
          variant="outline-secondary"
          name="assignmentGradeMinMax"
          disabled={isDisabled}
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
