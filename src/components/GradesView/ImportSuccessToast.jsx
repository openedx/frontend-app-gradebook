/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Toast } from '@edx/paragon';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import { views } from 'data/constants/app';
import messages from './ImportSuccessToast.messages';

/**
 * <ImportSuccessToast />
 * Toast component triggered by successful grade upload.
 * Provides a link to view the Bulk Management History tab.
 */
export class ImportSuccessToast extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.handleShowHistoryView = this.handleShowHistoryView.bind(this);
  }

  onClose() {
    this.props.setShow(false);
  }

  handleShowHistoryView() {
    this.props.setAppView(views.bulkManagementHistory);
    this.onClose();
  }

  render() {
    return (
      <Toast
        action={{
          label: this.props.intl.formatMessage(messages.showHistoryViewBtn),
          onClick: this.handleShowHistoryView,
        }}
        onClose={this.onClose}
        show={this.props.show}
      >
        {this.props.intl.formatMessage(messages.description)}
      </Toast>
    );
  }
}

ImportSuccessToast.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  show: PropTypes.bool.isRequired,
  setAppView: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  show: selectors.app.showImportSuccessToast(state),
});

export const mapDispatchToProps = {
  setAppView: actions.app.setView,
  setShow: actions.app.setShowImportSuccessToast,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ImportSuccessToast));
