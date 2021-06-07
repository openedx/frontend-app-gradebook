import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import initialFilters from 'data/constants/filters';
import selectors from 'data/selectors';

import RangeFilterBadge from './RangeFilterBadge';
import SingleValueFilterBadge from './SingleValueFilterBadge';

/**
 * FilterBadges
 * Displays a FilterBadge for each filter type in the data model with their current values.
 * @param {func} handleFilterBadgeClose - event taking a list of filternames to reset
 */
export const FilterBadges = ({
  assignment,
  assignmentType,
  cohortEntry,
  trackEntry,
  assignmentGradeMin,
  assignmentGradeMax,
  courseGradeMin,
  courseGradeMax,
  includeCourseRoleMembers,
  handleFilterBadgeClose,
}) => (
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
      handleBadgeClose={handleFilterBadgeClose([
        'assignment',
        'assignmentGradeMax',
        'assignmentGradeMin',
      ])}
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
      filterValue={trackEntry.name}
      handleBadgeClose={handleFilterBadgeClose(['track'])}
    />
    <SingleValueFilterBadge
      displayName="Cohort"
      filterName="cohort"
      filterValue={cohortEntry.name}
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
FilterBadges.defaultProps = {
  assignment: initialFilters.assignmentType,
  assignmentType: initialFilters.assignmentType,
  cohortEntry: { name: '' },
  trackEntry: { name: '' },
  assignmentGradeMin: initialFilters.assignmentGradeMin,
  assignmentGradeMax: initialFilters.assignmentGradeMax,
  courseGradeMin: initialFilters.courseGradeMin,
  courseGradeMax: initialFilters.courseGradeMax,
  includeCourseRoleMembers: initialFilters.includeCourseRoleMembers,
};
FilterBadges.propTypes = {
  handleFilterBadgeClose: PropTypes.func.isRequired,

  // redux
  assignment: PropTypes.string,
  assignmentType: PropTypes.string,
  cohortEntry: PropTypes.shape({ name: PropTypes.string }),
  trackEntry: PropTypes.shape({ name: PropTypes.string }),
  assignmentGradeMin: PropTypes.string,
  assignmentGradeMax: PropTypes.string,
  courseGradeMin: PropTypes.string,
  courseGradeMax: PropTypes.string,
  includeCourseRoleMembers: PropTypes.bool,
};

const mapStateToProps = state => (
  {
    assignment: selectors.filters.selectedAssignmentLabel(state),
    assignmentType: selectors.filters.assignmentType(state),
    cohortEntry: selectors.root.selectedCohortEntry(state),
    trackEntry: selectors.root.selectedTrackEntry(state),
    assignmentGradeMin: selectors.filters.assignmentGradeMin(state),
    assignmentGradeMax: selectors.filters.assignmentGradeMax(state),
    courseGradeMin: selectors.filters.courseGradeMin(state),
    courseGradeMax: selectors.filters.courseGradeMax(state),
    includeCourseRoleMembers: selectors.filters.includeCourseRoleMembers(state),
  }
);

export default connect(mapStateToProps)(FilterBadges);
