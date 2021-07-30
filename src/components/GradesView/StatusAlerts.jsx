import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatusAlert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import messages from './StatusAlerts.messages';

export class StatusAlerts extends React.Component {
  get isCourseGradeFilterAlertOpen() {
    return (
      !this.props.limitValidity.isMinValid
      || !this.props.limitValidity.isMaxValid
    );
  }

  get minValidityMessage() {
    return (this.props.limitValidity.isMinValid)
      ? ''
      : <FormattedMessage {...messages.minGradeInvalid} />;
  }

  get maxValidityMessage() {
    return (this.props.limitValidity.isMaxValid)
      ? ''
      : <FormattedMessage {...messages.maxGradeInvalid} />;
  }

  get courseGradeFilterAlertDialogText() {
    return (
      <>
        {this.minValidityMessage}{this.maxValidityMessage}
      </>
    );
  }

  render() {
    return (
      <>
        <StatusAlert
          alertType="success"
          dialog={<FormattedMessage {...messages.editSuccessAlert} />}
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
