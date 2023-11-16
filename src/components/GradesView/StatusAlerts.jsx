import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Alert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import messages from './StatusAlerts.messages';

export class StatusAlerts extends React.Component {
  get isCourseGradeFilterAlertOpen() {
    return (
      !this.props.courseLimitValidity.isMinValid
      || !this.props.courseLimitValidity.isMaxValid
      || !this.props.courseLimitValidity.isMinLessMaxValid
    );
  }

  get minCourseValidityMessage() {
    return (this.props.courseLimitValidity.isMinValid)
      ? ''
      : <FormattedMessage {...messages.minGradeInvalid} />;
  }

  get maxCourseValidityMessage() {
    return (this.props.courseLimitValidity.isMaxValid)
      ? ''
      : <FormattedMessage {...messages.maxGradeInvalid} />;
  }

  get minLessMaxCourseValidityMessage() {
    return (this.props.courseLimitValidity.isMinLessMaxValid)
      ? ''
      : <FormattedMessage {...messages.minLessMaxGradeInvalid} />;
  }

  get courseGradeFilterAlertDialogText() {
    return (
      <>
        {this.minCourseValidityMessage} {this.maxCourseValidityMessage} {this.minLessMaxCourseValidityMessage}
      </>
    );
  }

  get isAssignmentGradeFilterAlertOpen() {
    return (
      !this.props.assignmentLimitValidity.isMinValid
      || !this.props.assignmentLimitValidity.isMaxValid
      || !this.props.assignmentLimitValidity.isMinLessMaxValid
    );
  }

  get minAssignmentValidityMessage() {
    return (this.props.assignmentLimitValidity.isMinValid)
      ? ''
      : <FormattedMessage {...messages.minAssignmentInvalid} />;
  }

  get maxAssignmentValidityMessage() {
    return (this.props.assignmentLimitValidity.isMaxValid)
      ? ''
      : <FormattedMessage {...messages.maxAssignmentInvalid} />;
  }

  get minLessMaxAssignmentValidityMessage() {
    return (this.props.assignmentLimitValidity.isMinLessMaxValid)
      ? ''
      : <FormattedMessage {...messages.minLessMaxAssignmentInvalid} />;
  }

  get assignmentGradeFilterAlertDialogText() {
    return (
      <>
        {/* eslint-disable-next-line max-len */}
        {this.minAssignmentValidityMessage} {this.maxAssignmentValidityMessage} {this.minLessMaxAssignmentValidityMessage}
      </>
    );
  }

  render() {
    return (
      <>
        <Alert
          variant="success"
          onClose={this.props.handleCloseSuccessBanner}
          show={this.props.showSuccessBanner}
        >
          <FormattedMessage {...messages.editSuccessAlert} />
        </Alert>
        <Alert
          variant="danger"
          dismissible={false}
          show={this.isAssignmentGradeFilterAlertOpen}
        >
          {this.assignmentGradeFilterAlertDialogText}
        </Alert>
        <Alert
          variant="success"
          onClose={this.props.handleCloseSuccessBanner}
          show={this.props.showSuccessBanner}
        >
          <FormattedMessage {...messages.editSuccessAlert} />
        </Alert>
        <Alert
          variant="danger"
          dismissible={false}
          show={this.isCourseGradeFilterAlertOpen}
        >
          {this.courseGradeFilterAlertDialogText}
        </Alert>
      </>
    );
  }
}

StatusAlerts.defaultProps = {
};

StatusAlerts.propTypes = {
  // redux
  handleCloseSuccessBanner: PropTypes.func.isRequired,
  courseLimitValidity: PropTypes.shape({
    isMaxValid: PropTypes.bool,
    isMinValid: PropTypes.bool,
    isMinLessMaxValid: PropTypes.bool,
  }).isRequired,
  assignmentLimitValidity: PropTypes.shape({
    isMaxValid: PropTypes.bool,
    isMinValid: PropTypes.bool,
    isMinLessMaxValid: PropTypes.bool,
  }).isRequired,
  showSuccessBanner: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  courseLimitValidity: selectors.app.courseGradeFilterValidity(state),
  assignmentLimitValidity: selectors.app.assignmentGradeFilterValidity(state),
  showSuccessBanner: selectors.grades.showSuccess(state),
});

export const mapDispatchToProps = {
  handleCloseSuccessBanner: actions.grades.banner.close,
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusAlerts);
