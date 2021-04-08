import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import initialFilters from '../../data/constants/filters';

function FilterBadge({
  name, value, onClick, showValue,
}) {
  return (
    <div>
      <span className="badge badge-info">
        <span>{name}{showValue && `: ${value}`}</span>
        <button type="button" className="btn-info" aria-label="Close" onClick={onClick}>
          <span aria-hidden="true">&times;</span>
        </button>
      </span>
      <br />
    </div>
  );
}

FilterBadge.defaultProps = {
  showValue: true,
};

FilterBadge.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  showValue: PropTypes.bool,
};

function RangeFilterBadge({
  displayName,
  filterName1,
  filterValue1,
  filterName2,
  filterValue2,
  handleBadgeClose,
}) {
  return ((filterValue1 !== initialFilters[filterName1])
  || (filterValue2 !== initialFilters[filterName2]))
   && (
   <FilterBadge
     name={displayName}
     value={`${filterValue1} - ${filterValue2}`}
     onClick={handleBadgeClose}
   />
   );
}
RangeFilterBadge.propTypes = {
  displayName: PropTypes.string.isRequired,
  filterName1: PropTypes.string.isRequired,
  filterValue1: PropTypes.string.isRequired,
  filterName2: PropTypes.string.isRequired,
  filterValue2: PropTypes.string.isRequired,
  handleBadgeClose: PropTypes.func.isRequired,
};

function SingleValueFilterBadge({
  displayName, filterName, filterValue, handleBadgeClose, showValue,
}) {
  return (filterValue !== initialFilters[filterName])
  && (
  <FilterBadge
    name={displayName}
    value={filterValue}
    onClick={handleBadgeClose}
    showValue={showValue}
  />
  );
}

SingleValueFilterBadge.defaultProps = {
  showValue: true,
};

SingleValueFilterBadge.propTypes = {
  displayName: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  filterValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  handleBadgeClose: PropTypes.func.isRequired,
  showValue: PropTypes.bool,
};

function FilterBadges({
  assignment,
  assignmentType,
  track,
  cohort,
  assignmentGradeMin,
  assignmentGradeMax,
  courseGradeMin,
  courseGradeMax,
  includeCourseRoleMembers,
  handleFilterBadgeClose,
}) {
  return (
    <div>
      <SingleValueFilterBadge
        displayName="Assignment Type"
        filterName="assignmentType"
        filterValue={assignmentType}
        handleBadgeClose={handleFilterBadgeClose(['assignmentType'])}
      />
      <SingleValueFilterBadge
        displayName="Assignment"
        filterName="assignment"
        filterValue={assignment}
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
        filterName="cohort"
        filterValue={cohort}
        handleBadgeClose={handleFilterBadgeClose(['cohort'])}
      />
      <SingleValueFilterBadge
        displayName="Including Course Team Members"
        filterName="includeCourseRoleMembers"
        filterValue={includeCourseRoleMembers}
        showValue={false}
        handleBadgeClose={handleFilterBadgeClose(['includeCourseRoleMembers'])}
      />
    </div>
  );
}

const mapStateToProps = state => (
  {
    assignment: (state.filters.assignment || {}).label,
    assignmentType: state.filters.assignmentType,
    track: state.filters.track,
    cohort: state.filters.cohort,
    assignmentGradeMin: state.filters.assignmentGradeMin,
    assignmentGradeMax: state.filters.assignmentGradeMax,
    courseGradeMin: state.filters.courseGradeMin,
    courseGradeMax: state.filters.courseGradeMax,
    includeCourseRoleMembers: state.filters.includeCourseRoleMembers,
  }
);

const ConnectedFilterBadges = connect(mapStateToProps)(FilterBadges);
export default ConnectedFilterBadges;

FilterBadges.defaultProps = {
  assignment: initialFilters.assignmentType,
  assignmentType: initialFilters.assignmentType,
  track: initialFilters.track,
  cohort: initialFilters.cohort,
  assignmentGradeMin: initialFilters.assignmentGradeMin,
  assignmentGradeMax: initialFilters.assignmentGradeMax,
  courseGradeMin: initialFilters.courseGradeMin,
  courseGradeMax: initialFilters.courseGradeMax,
  includeCourseRoleMembers: initialFilters.includeCourseRoleMembers,
};

FilterBadges.propTypes = {
  assignment: PropTypes.string,
  assignmentType: PropTypes.string,
  track: PropTypes.string,
  cohort: PropTypes.string,
  assignmentGradeMin: PropTypes.string,
  assignmentGradeMax: PropTypes.string,
  courseGradeMin: PropTypes.string,
  courseGradeMax: PropTypes.string,
  includeCourseRoleMembers: PropTypes.bool,
  handleFilterBadgeClose: PropTypes.func.isRequired,
};
