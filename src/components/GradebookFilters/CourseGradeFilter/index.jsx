/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import messages from '../messages';
import PercentGroup from '../PercentGroup';

export class CourseGradeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleUpdateMin = this.handleUpdateMin.bind(this);
    this.handleUpdateMax = this.handleUpdateMax.bind(this);
    this.updateCourseGradeFilters = this.updateCourseGradeFilters.bind(this);
  }

  handleApplyClick() {
    if (this.props.areLimitsValid) {
      this.updateCourseGradeFilters();
    }
  }

  handleUpdateMin({ target: { value } }) {
    this.props.setLocalFilter({ courseGradeMin: value });
  }

  handleUpdateMax({ target: { value } }) {
    this.props.setLocalFilter({ courseGradeMax: value });
  }

  updateCourseGradeFilters() {
    this.props.updateFilter(this.props.localCourseLimits);
    this.props.fetchGrades();
    this.props.updateQueryParams(this.props.localCourseLimits);
  }

  render() {
    const {
      localCourseLimits: { courseGradeMin, courseGradeMax },
    } = this.props;
    return (
      <>
        <div className="grade-filter-inputs">
          <PercentGroup
            id="minimum-grade"
            label={<FormattedMessage {...messages.minGrade} />}
            value={courseGradeMin}
            onChange={this.handleUpdateMin}
          />
          <PercentGroup
            id="maximum-grade"
            label={<FormattedMessage {...messages.maxGrade} />}
            value={courseGradeMax}
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
      </>
    );
  }
}

CourseGradeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,

  // Redux
  areLimitsValid: PropTypes.bool.isRequired,
  fetchGrades: PropTypes.func.isRequired,
  localCourseLimits: PropTypes.shape({
    courseGradeMin: PropTypes.string.isRequired,
    courseGradeMax: PropTypes.string.isRequired,
  }).isRequired,
  setLocalFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  areLimitsValid: selectors.app.areCourseGradeFiltersValid(state),
  localCourseLimits: selectors.app.courseGradeLimits(state),
});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  setLocalFilter: actions.app.setLocalFilter,
  updateFilter: actions.filters.update.courseGradeLimits,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseGradeFilter);
