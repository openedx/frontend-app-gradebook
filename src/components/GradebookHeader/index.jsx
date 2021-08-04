import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { configuration } from 'config';
import selectors from 'data/selectors';

import messages from './messages';

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
          <span aria-hidden="true">{'<< '}</span>
          <FormattedMessage {...messages.backToDashboard} />
        </a>
        <h1>
          <FormattedMessage {...messages.gradebook} />
        </h1>
        <h3>{this.props.courseId}</h3>
        {this.props.areGradesFrozen
          && (
          <div className="alert alert-warning" role="alert">
            <FormattedMessage {...messages.frozenWarning} />
          </div>
          )}
        {(this.props.canUserViewGradebook === false) && (
          <div className="alert alert-warning" role="alert">
            <FormattedMessage {...messages.unauthorizedWarning} />
          </div>
        )}
      </div>
    );
  }
}

GradebookHeader.defaultProps = {
  // redux
  courseId: '',
  areGradesFrozen: false,
  canUserViewGradebook: false,
};

GradebookHeader.propTypes = {
  // redux
  courseId: PropTypes.string,
  areGradesFrozen: PropTypes.bool,
  canUserViewGradebook: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  courseId: selectors.app.courseId(state),
  areGradesFrozen: selectors.assignmentTypes.areGradesFrozen(state),
  canUserViewGradebook: selectors.roles.canUserViewGradebook(state),
});

export default connect(mapStateToProps)(GradebookHeader);
