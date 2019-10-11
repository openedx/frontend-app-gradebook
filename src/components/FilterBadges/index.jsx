
import React from 'react';
import PropTypes from 'prop-types';
import initialFilters from '../../data/constants/filters';

/*
  Active filter values are stored in GradebookPage State, passed into props in selected* variables
  The displayed numbers on the page are in the Gradebook State
  A filter is considered 'active' is if it has a value other than its initial value

  If we want to 'disable' a filter, we must fire off an action to update
  the Page state and remove the 'functional' filters

  In some cases we will also have to update the local state to remove the value (grade ranges)
  After that, we will have to re-fetch grades

  Filters:
    AssnType
    Assn
    Assn Grade Min \
                    > assn grade range
    Assn Grade Max /

    Course Grade Min   \
                        > course grade range
    Course Grade Max   /

    Track
    Cohort

  Combined/dependent filters:
  If assn is removed, we must also remove course grade range (max and min)

  The max and min filters aren't really independent values,
  They're two values combined into one filter.
  TheY should be displayed as one filter and be cleared together
*/

function renderBadge(displayName, displayValue, onClick) {
  return (
    <div>
      <span className="badge badge-info">
        <span>{`${displayName}: ${displayValue}`}</span>
        <button type="button" className="btn-info" aria-label="Close" onClick={onClick}>
          <span aria-hidden="true">&times;</span>
        </button>
      </span>
      <br />
    </div>
  );
}

function renderRangeFilterBadge(
  displayName,
  filterName1,
  filterValue1,
  filterName2,
  filterValue2,
  handleBadgeClose,

) {
  return (
    (filterValue1 !== initialFilters[filterName1]) ||
            (filterValue2 !== initialFilters[filterName2])
  ) && renderBadge(
    displayName,
    `${filterValue1} - ${filterValue2}`,
    handleBadgeClose,
  );
}


function renderSingleValueFilterBadge(
  displayName,
  filterName,
  filterValue,
  handleClose,
) {
  return (filterValue !== initialFilters[filterName]) &&
    renderBadge(displayName, filterValue, handleClose);
}

export default function FilterBadges(
  {
    selectedAssignmentType,
    selectedAssignment,
    selectedTrack,
    selectedCohort,
    selectedAssignmentGradeMin,
    selectedAssignmentGradeMax,
    selectedCourseGradeMin,
    selectedCourseGradeMax,
  },
  handleFilterBadgeClose,
) {
  return (
    <div>
      {
        renderSingleValueFilterBadge(
          'Assignment Type',
          'assignmentType',
          selectedAssignmentType,
          handleFilterBadgeClose(['assignmentType']),
        )
      }
      {
        renderSingleValueFilterBadge(
          'Assignment',
          'assignment',
          selectedAssignment,
          handleFilterBadgeClose(['assignment', 'assignmentGradeMax', 'assignmentGradeMin']),
        )
      }
      {
        renderRangeFilterBadge(
          'Assignment Grade',
          'assignmentGradeMin',
          selectedAssignmentGradeMin,
          'assignmentGradeMax',
          selectedAssignmentGradeMax,
          handleFilterBadgeClose(['assignmentGradeMin', 'assignmentGradeMax']),
        )
      }
      {
        renderRangeFilterBadge(
          'Course Grade',
          'courseGradeMin',
          selectedCourseGradeMin,
          'courseGradeMax',
          selectedCourseGradeMax,
          handleFilterBadgeClose(['courseGradeMin', 'courseGradeMax']),
        )
      }
      {renderSingleValueFilterBadge('Track', 'track', selectedTrack, handleFilterBadgeClose(['track']))}
      {renderSingleValueFilterBadge('Cohort', 'track', selectedCohort, handleFilterBadgeClose(['cohort']))}
    </div>
  );
}

FilterBadges.propTypes = {
  selectedAssignmentType: PropTypes.string.isRequired,
  selectedAssignment: PropTypes.string.isRequired,
  selectedTrack: PropTypes.string.isRequired,
  selectedCohort: PropTypes.string.isRequired,
  selectedAssignmentGradeMin: PropTypes.string.isRequired,
  selectedAssignmentGradeMax: PropTypes.string.isRequired,
  selectedCourseGradeMin: PropTypes.string.isRequired,
  selectedCourseGradeMax: PropTypes.string.isRequired,
};

