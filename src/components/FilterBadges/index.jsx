
import React from 'react';
import PropTypes from 'prop-types';
import initialFilters from '../../data/constants/filters';
import { connect } from 'react-redux';

function FilterBadge({ displayName, displayValue, onClick }) {
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

function RangeFilterBadge({
  displayName,
  filterName1,
  filterValue1,
  filterName2,
  filterValue2,
  handleBadgeClose,
}) {
  return ((filterValue1 !== initialFilters[filterName1]) ||
  (filterValue2 !== initialFilters[filterName2]))
   &&
   <FilterBadge
     displayName={displayName}
     filterValue={`${filterValue1} - ${filterValue2}`}
     onClick={handleBadgeClose}
   />;
}


function SingleValueFilterBadge({
  displayName, filterName, filterValue, handleBadgeClose,
}) {
  return (filterValue !== initialFilters[filterName]) &&
  <FilterBadge
    displayName={displayName}
    filterValue={filterValue}
    onClick={handleBadgeClose}
  />;
}

function FilterBadges({
  assignment,
  assignmentType,
  track,
  cohort,
  assignmentGradeMin,
  assignmentGradeMax,
  courseGradeMin,
  courseGradeMax,
  handleFilterBadgeClose,
}) {
  return (
    <div>
      <SingleValueFilterBadge
        displayName="Assignment Type"
        filterName="assignmentType"
        filterValue={assignment}
        handleBadgeClose={handleFilterBadgeClose(['assignmentType'])}
      />
      <SingleValueFilterBadge
        displayName="Assignment"
        filterName="assignment"
        filterValue={assignmentType}
        handleBadgeClose={handleFilterBadgeClose(['assignment', 'assignmentGradeMax', 'assignmentGradeMin'])}
      />
      <RangeFilterBadge
        displayName="Assignment Grade"
        filterName1="assignmentGradeMin"
        filterValue1={assignmentGradeMin}
        filterName2="assignmentGradeMax"
        filterValue2={assignmentGradeMax}
        handleBadgeClose={handleFilterBadgeClose(['assignmentGradeMin', 'assignmentGradeMax'])}
      />
      <RangeFilterBadge
        displayName="Course Grade"
        filterName1="courseGradeMin"
        filterValue1={courseGradeMin}
        filterName2="courseGradeMax"
        filterValue2={courseGradeMax}
        handleBadgeClose={handleFilterBadgeClose(['courseGradeMin', 'courseGradeMax'])}
      />
      <SingleValueFilterBadge
        displayName="Track"
        filterName="track"
        filterValue={track}
        handleBadgeClose={handleFilterBadgeClose(['track'])}
      />
      <SingleValueFilterBadge
        displayName="Cohort"
        filterName="track"
        filterValue={cohort}
        handleBadgeClose={handleFilterBadgeClose(['cohort'])}
      />
    </div>
  );
}

const mapStateToProps = state => (
  {
    assignment: state.filters.assignment,
    assignmentType: state.filters.assignmentType,
    track: state.filters.track,
    cohort: state.filters.cohort,
    assignmentGradeMin: state.filters.assignmentGradeMin,
    assignmentGradeMax: state.filters.assignmentGradeMax,
    courseGradeMin: state.filters.courseGradeMin,
    courseGradeMax: state.filters.courseGradeMax,
  }
);

const ConnectedFilterBadges = connect(mapStateToProps)(FilterBadges);
export default ConnectedFilterBadges;

FilterBadge.propTypes = {
  displayName: PropTypes.string.isRequired,
  displayValue: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

FilterBadges.propTypes = {
  assignment: PropTypes.string.isRequired,
  assignmentType: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  cohort: PropTypes.string.isRequired,
  assignmentGradeMin: PropTypes.string.isRequired,
  assignmentGradeMax: PropTypes.string.isRequired,
  courseGradeMin: PropTypes.string.isRequired,
  courseGradeMax: PropTypes.string.isRequired,
  handleFilterBadgeClose: PropTypes.func.isRequired,
};

