import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { views } from 'data/constants/app';
import actions from 'data/actions';
import selectors from 'data/selectors';

import messages from './messages';

export class GradebookHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleViewClick = this.handleToggleViewClick.bind(this);
  }

  get toggleViewMessage() {
    return this.props.activeView === views.grades
      ? messages.toActivityLog
      : messages.toGradesView;
  }

  lmsInstructorDashboardUrl = courseId => (
    `${getConfig().LMS_BASE_URL}/courses/${courseId}/instructor`
  );

  handleToggleViewClick() {
    const newView = this.props.activeView === views.grades ? views.bulkManagementHistory : views.grades;
    this.props.setView(newView);
  }

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
        <div className="subtitle-row d-flex justify-content-between align-items-center">
          <h3>{this.props.courseId}</h3>
          { this.props.showBulkManagement && (
            <Button
              variant="tertiary"
              onClick={this.handleToggleViewClick}
            >
              <FormattedMessage {...this.toggleViewMessage} />
            </Button>
          )}
        </div>
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
  showBulkManagement: false,
};

GradebookHeader.propTypes = {
  // redux
  activeView: PropTypes.string.isRequired,
  courseId: PropTypes.string,
  areGradesFrozen: PropTypes.bool,
  canUserViewGradebook: PropTypes.bool,
  setView: PropTypes.func.isRequired,
  showBulkManagement: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  activeView: selectors.app.activeView(state),
  courseId: selectors.app.courseId(state),
  areGradesFrozen: selectors.assignmentTypes.areGradesFrozen(state),
  canUserViewGradebook: selectors.roles.canUserViewGradebook(state),
  showBulkManagement: selectors.root.showBulkManagement(state),
});

export const mapDispatchToProps = {
  setView: actions.app.setView,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookHeader);
