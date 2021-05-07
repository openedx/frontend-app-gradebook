import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatusAlert } from '@edx/paragon';

import selectors from 'data/selectors';
import * as actions from 'data/actions';

export const maxCourseGradeInvalidMessage = 'Maximum course grade value must be between 0 and 100. ';
export const minCourseGradeInvalidMessage = 'Minimum course grade value must be between 0 and 100. ';

export class StatusAlerts extends React.Component {
  get isCourseGradeFilterAlertOpen() {
    const r = !this.props.isMinCourseGradeFilterValid
    || !this.props.isMaxCourseGradeFilterValid;
    return r;
  }

  get courseGradeFilterAlertDialogText() {
    let dialogText = '';
    if (!this.props.isMinCourseGradeFilterValid) {
      dialogText += minCourseGradeInvalidMessage;
    }
    if (!this.props.isMaxCourseGradeFilterValid) {
      dialogText += maxCourseGradeInvalidMessage;
    }
    return dialogText;
  }

  render() {
    return (
      <>
        <StatusAlert
          alertType="success"
          dialog="The grade has been successfully edited. You may see a slight delay before updates appear in the Gradebook."
          onClose={this.props.handleCloseSuccessBanner}
          open={this.props.showSuccessBanner}
        />
        <StatusAlert
          alertType="danger"
          dialog={this.courseGradeFilterAlertDialogText}
          dismissible={false}
          open={this.isCourseGradeFilterAlertOpen}
        />
      </>
    );
  }
}

StatusAlerts.defaultProps = {
  isMinCourseGradeFilterValid: true,
  isMaxCourseGradeFilterValid: true,
};

StatusAlerts.propTypes = {
  isMinCourseGradeFilterValid: PropTypes.bool,
  isMaxCourseGradeFilterValid: PropTypes.bool,
  // redux
  handleCloseSuccessBanner: PropTypes.func.isRequired,
  showSuccessBanner: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  showSuccessBanner: selectors.grades.showSuccess(state),
});

export const mapDispatchToProps = {
  handleCloseSuccessBanner: actions.grades.banner.close,
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusAlerts);
