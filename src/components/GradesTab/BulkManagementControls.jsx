/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatefulButton, Icon } from '@edx/paragon';

import { StrictDict } from 'utils';
import actions from 'data/actions';
import selectors from 'data/selectors';

export const basicButtonProps = () => ({
  variant: 'outline-primary',
  icons: {
    default: <Icon className="fa fa-download mr-2" />,
    pending: <Icon className="fa fa-spinner fa-spin mr-2" />,
  },
  disabledStates: ['pending'],
  className: 'ml-2',
});

export const buttonStates = StrictDict({
  pending: 'pending',
  default: 'default',
});

/**
 * <BulkManagementControls />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export class BulkManagementControls extends React.Component {
  constructor(props) {
    super(props);
    this.buttonProps = this.buttonProps.bind(this);
    this.handleClickDownloadInterventions = this.handleClickDownloadInterventions.bind(this);
    this.handleClickExportGrades = this.handleClickExportGrades.bind(this);
  }

  buttonProps(label) {
    return {
      labels: { default: label, pending: label },
      state: this.props.showSpinner ? 'pending' : 'default',
      ...basicButtonProps(),
    };
  }

  handleClickDownloadInterventions() {
    this.props.downloadInterventionReport();
    window.location.assign(this.props.interventionExportUrl);
  }

  // At present, we don't store label and value in google analytics. By setting the label
  // property of the below events, I want to verify that we can set the label of google anlatyics
  // The following properties of a google analytics event are:
  // category (used), name(used), label(not used), value(not used)
  handleClickExportGrades() {
    this.props.downloadBulkGradesReport();
    window.location.assign(this.props.gradeExportUrl);
  }

  render() {
    return this.props.showBulkManagement && (
      <div>
        <StatefulButton
          {...this.buttonProps('Bulk Management')}
          onClick={this.handleClickExportGrades}
        />
        <StatefulButton
          {...this.buttonProps('Interventions')}
          onClick={this.handleClickDownloadInterventions}
        />
      </div>
    );
  }
}

BulkManagementControls.defaultProps = {
  showBulkManagement: false,
  showSpinner: false,
};

BulkManagementControls.propTypes = {
  // redux
  downloadBulkGradesReport: PropTypes.func.isRequired,
  downloadInterventionReport: PropTypes.func.isRequired,
  gradeExportUrl: PropTypes.string.isRequired,
  interventionExportUrl: PropTypes.string.isRequired,
  showSpinner: PropTypes.bool,
  showBulkManagement: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  gradeExportUrl: selectors.root.gradeExportUrl(state),
  interventionExportUrl: selectors.root.interventionExportUrl(state),
  showBulkManagement: selectors.root.showBulkManagement(state),
  showSpinner: selectors.root.shouldShowSpinner(state),
});

export const mapDispatchToProps = {
  downloadBulkGradesReport: actions.grades.downloadReport.bulkGrades,
  downloadInterventionReport: actions.grades.downloadReport.intervention,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagementControls);
