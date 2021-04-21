/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Collapsible,
  InputText,
} from '@edx/paragon';

import { updateAssignmentLimits } from '../../data/actions/filters';
import { fetchGrades } from '../../data/actions/grades';

export class CourseGradeFilters extends React.Component {
  handleChange = (type, value) => {
    const filterValue = value;
    const setFilter = (type === 'min') ? this.props.setCourseGradeMin : this.props.setCourseGradeMax;
    setFilter(filterValue);
  }

  handleApplyClick = () => {
    const {
      courseGradeMin,
      courseGradeMax,
      courseId,
      getUserGrades,
      selectedAssignmentType,
      selectedCohort,
      selectedTrack,
      setIsMinCourseGradeFilterValid,
      setIsMaxCourseGradeFilterValid,
      updateFilter,
      updateQueryParams,
    } = this.props;

    const isMinValid = this.isGradeFilterValueInRange(courseGradeMin);
    const isMaxValid = this.isGradeFilterValueInRange(courseGradeMax);

    setIsMinCourseGradeFilterValid(isMinValid);
    setIsMaxCourseGradeFilterValid(isMaxValid);

    if (isMinValid && isMaxValid) {
      updateFilter(
        courseGradeMin,
        courseGradeMax,
        courseId,
      );
      getUserGrades(
        courseId,
        selectedCohort,
        selectedTrack,
        selectedAssignmentType,
        { courseGradeMin, courseGradeMax },
      );
      updateQueryParams({ courseGradeMin, courseGradeMax });
    }
  }

  isGradeFilterValueInRange = (value) => {
    const valueAsInt = parseInt(value, 10);
    return valueAsInt >= 0 && valueAsInt <= 100;
  };

  render() {
    return (
      <Collapsible title="Overall Grade" defaultOpen className="filter-group mb-3">
        <div className="grade-filter-inputs">
          <div className="percent-group">
            <InputText
              value={this.props.courseGradeMin}
              name="minimum-grade"
              label="Min Grade"
              onChange={value => this.handleChange('min', value)}
              type="number"
              min={0}
              max={100}
            />
            <span className="input-percent-label">%</span>
          </div>
          <div className="percent-group">
            <InputText
              value={this.props.courseGradeMax}
              name="max-grade"
              label="Max Grade"
              onChange={value => this.handleChange('max', value)}
              type="number"
              min={0}
              max={100}
            />
            <span className="input-percent-label">%</span>
          </div>
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
  updateFilter: updateAssignmentLimits,
  getUserGrades: fetchGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseGradeFilters);
