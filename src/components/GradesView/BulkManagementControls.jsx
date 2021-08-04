/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { views } from 'data/constants/app';
import actions from 'data/actions';
import selectors from 'data/selectors';

import NetworkButton from 'components/NetworkButton';
import ImportGradesButton from './ImportGradesButton';

import messages from './BulkManagementControls.messages';

/**
 * <BulkManagementControls />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export class BulkManagementControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickExportGrades = this.handleClickExportGrades.bind(this);
    this.handleViewActivityLog = this.handleViewActivityLog.bind(this);
  }

  handleClickExportGrades() {
    this.props.downloadBulkGradesReport();
    window.location.assign(this.props.gradeExportUrl);
  }

  handleViewActivityLog() {
    this.props.setView(views.bulkManagementHistory);
  }

  render() {
    return this.props.showBulkManagement && (
      <div className="d-flex">
        <NetworkButton
          label={messages.downloadGradesBtn}
          onClick={this.handleClickExportGrades}
        />
        <ImportGradesButton />
      </div>
    );
  }
}

BulkManagementControls.defaultProps = {
  showBulkManagement: false,
};

BulkManagementControls.propTypes = {
  // redux
  downloadBulkGradesReport: PropTypes.func.isRequired,
  gradeExportUrl: PropTypes.string.isRequired,
  showBulkManagement: PropTypes.bool,
  setView: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradeExportUrl: selectors.root.gradeExportUrl(state),
  showBulkManagement: selectors.root.showBulkManagement(state),
});

export const mapDispatchToProps = {
  downloadBulkGradesReport: actions.grades.downloadReport.bulkGrades,
  setView: actions.app.setView,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagementControls);
