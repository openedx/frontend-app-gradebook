/* eslint-disable react/sort-comp, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';

import { Collapsible } from '@edx/paragon';

import AssignmentTypeFilter from './AssignmentTypeFilter';
import AssignmentFilter from './AssignmentFilter';
import AssignmentGradeFilter from './AssignmentGradeFilter';

export const AssignmentFilters = ({
  courseId,
  assignmentGradeMax,
  assignmentGradeMin,
  setAssignmentGradeMax,
  setAssignmentGradeMin,
  updateQueryParams,
}) => (
  <Collapsible title="Assignments" defaultOpen className="filter-group mb-3">
    <div>
      <AssignmentTypeFilter
        updateQueryParams={updateQueryParams}
      />
      <AssignmentFilter
        courseId={courseId}
        updateQueryParams={updateQueryParams}
      />
      <AssignmentGradeFilter
        courseId={courseId}
        assignmentGradeMin={assignmentGradeMin}
        assignmentGradeMax={assignmentGradeMax}
        setAssignmentGradeMin={setAssignmentGradeMin}
        setAssignmentGradeMax={setAssignmentGradeMax}
        updateQueryParams={updateQueryParams}
      />
    </div>
  </Collapsible>
);

AssignmentFilters.propTypes = {
  assignmentGradeMin: PropTypes.string.isRequired,
  assignmentGradeMax: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  setAssignmentGradeMin: PropTypes.func.isRequired,
  setAssignmentGradeMax: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentFilters;
