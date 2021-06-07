import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatusAlert } from '@edx/paragon';

import selectors from 'data/selectors';
import actions from 'data/actions';

export const maxCourseGradeInvalidMessage = 'Maximum course grade value must be between 0 and 100. ';
export const minCourseGradeInvalidMessage = 'Minimum course grade value must be between 0 and 100. ';

export class StatusAlerts extends React.Component {
  get isCourseGradeFilterAlertOpen() {
    return (
      !this.props.limitValidity.isMinValid
      || !this.props.limitValidity.isMaxValid
    );
  }

  get courseGradeFilterAlertDialogText() {
    let dialogText = '';
    if (!this.props.limitValidity.isMinValid) {
      dialogText += minCourseGradeInvalidMessage;
    }
    if (!this.props.limitValidity.isMaxValid) {
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
};

StatusAlerts.propTypes = {
  // redux
  handleCloseSuccessBanner: PropTypes.func.isRequired,
  limitValidity: PropTypes.shape({
    isMaxValid: PropTypes.bool,
    isMinValid: PropTypes.bool,
  }).isRequired,
  showSuccessBanner: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  limitValidity: selectors.app.courseGradeFilterValidity(state),
  showSuccessBanner: selectors.grades.showSuccess(state),
});

export const mapDispatchToProps = {
  handleCloseSuccessBanner: actions.grades.banner.close,
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusAlerts);
