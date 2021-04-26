/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Collapsible,
} from '@edx/paragon';

import { updateCourseGradeFilter } from 'data/actions/filters';
import { fetchGrades } from 'data/actions/grades';
import PercentGroup from '../PercentGroup';

export class CourseGradeFilters extends React.Component {
  constructor(props) {
    super(props);
    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleUpdateMin = this.handleUpdateMin.bind(this);
    this.handleUpdateMax = this.handleUpdateMax.bind(this);
    this.updateAPI = this.updateAPI.bind(this);
  }

  handleApplyClick() {
    const isMinValid = this.isGradeFilterValueInRange(this.props.courseGradeMin);
    const isMaxValid = this.isGradeFilterValueInRange(this.props.courseGradeMax);

    this.props.setIsMinCourseGradeFilterValid(isMinValid);
    this.props.setIsMaxCourseGradeFilterValid(isMaxValid);

    if (isMinValid && isMaxValid) {
      this.updateAPI();
    }
  }

  updateAPI() {
    const { courseGradeMin, courseGradeMax } = this.props;
    this.props.updateFilter(
      courseGradeMin,
      courseGradeMax,
      this.props.courseId,
    );
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
      { courseGradeMin, courseGradeMax },
    );
    this.props.updateQueryParams({ courseGradeMin, courseGradeMax });
  }

  handleUpdateMin(event) {
    this.props.setCourseGradeMin(event.target.value);
  }

  handleUpdateMax(event) {
    this.props.setCourseGradeMax(event.target.value);
  }

  isGradeFilterValueInRange = (value) => {
    const valueAsInt = parseInt(value, 10);
    return valueAsInt >= 0 && valueAsInt <= 100;
  };

  render() {
    return (
      <Collapsible title="Overall Grade" defaultOpen className="filter-group mb-3">
        <div className="grade-filter-inputs">
          <PercentGroup
            id="minimum-grade"
            label="Min Grade"
            value={this.props.courseGradeMin}
            onChange={this.handleUpdateMin}
          />
          <PercentGroup
            id="maximum-grade"
            label="Max Grade"
            value={this.props.courseGradeMax}
            onChange={this.handleUpdateMax}
          />
        </div>
        <div className="grade-filter-action">
          <Button
            variant="outline-secondary"
            onClick={this.handleApplyClick}
          >
            Apply
          </Button>
        </div>
      </Collapsible>
    );
  }
}

CourseGradeFilters.defaultProps = {
  courseId: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
};

CourseGradeFilters.propTypes = {
  courseGradeMin: PropTypes.string.isRequired,
  courseGradeMax: PropTypes.string.isRequired,
  courseId: PropTypes.string,
  setCourseGradeMin: PropTypes.func.isRequired,
  setCourseGradeMax: PropTypes.func.isRequired,
  setIsMaxCourseGradeFilterValid: PropTypes.func.isRequired,
  setIsMinCourseGradeFilterValid: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,
  // Redux
  getUserGrades: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  updateFilter: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
  selectedAssignmentType: state.filters.assignmentType,
});

export const mapDispatchToProps = {
  updateFilter: updateCourseGradeFilter,
  getUserGrades: fetchGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseGradeFilters);
