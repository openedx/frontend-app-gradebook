import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { configuration } from 'config';
import selectors from 'data/selectors';

export class GradebookHeader extends React.Component {
  lmsInstructorDashboardUrl = courseId => (
    `${configuration.LMS_BASE_URL}/courses/${courseId}/instructor`
  );

  render() {
    return (
      <div className="gradebook-header">
        <a
          href={this.lmsInstructorDashboardUrl(this.props.courseId)}
          className="mb-3"
        >
          <span aria-hidden="true">{'<< '}</span> Back to Dashboard
        </a>
        <h1>Gradebook</h1>
        <h3> {this.props.courseId}</h3>
        {this.props.areGradesFrozen
          && (
          <div className="alert alert-warning" role="alert">
            The grades for this course are now frozen. Editing of grades is no longer allowed.
          </div>
          )}
        {(this.props.canUserViewGradebook === false) && (
          <div className="alert alert-warning" role="alert">
            You are not authorized to view the gradebook for this course.
          </div>
        )}
      </div>
    );
  }
}

GradebookHeader.defaultProps = {
  courseId: '',
  // redux
  areGradesFrozen: false,
  canUserViewGradebook: false,
};

GradebookHeader.propTypes = {
  courseId: PropTypes.string,
  // redux
  areGradesFrozen: PropTypes.bool,
  canUserViewGradebook: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  areGradesFrozen: selectors.assignmentTypes.areGradesFrozen(state),
  canUserViewGradebook: selectors.roles.canUserViewGradebook(state),
});

export default connect(mapStateToProps)(GradebookHeader);
