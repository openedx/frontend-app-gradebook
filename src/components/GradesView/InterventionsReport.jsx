/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';

import NetworkButton from 'components/NetworkButton';
import messages from './InterventionsReport.messages';

/**
 * <InterventionsReport />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export class InterventionsReport extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.downloadInterventionReport();
    window.location.assign(this.props.interventionExportUrl);
  }

  render() {
    return this.props.showBulkManagement && (
      <div>
        <h4 className="mt-0">
          <FormattedMessage {...messages.title} />
        </h4>
        <div
          className="d-flex justify-content-between align-items-center"
        >
          <div className="intervention-report-description">
            <FormattedMessage {...messages.description} />
          </div>
          <NetworkButton
            label={messages.downloadBtn}
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

InterventionsReport.defaultProps = {
  showBulkManagement: false,
};

InterventionsReport.propTypes = {
  // redux
  downloadInterventionReport: PropTypes.func.isRequired,
  interventionExportUrl: PropTypes.string.isRequired,
  showBulkManagement: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  interventionExportUrl: selectors.root.interventionExportUrl(state),
  showBulkManagement: selectors.root.showBulkManagement(state),
});

export const mapDispatchToProps = {
  downloadInterventionReport: actions.grades.downloadReport.intervention,
};

export default connect(mapStateToProps, mapDispatchToProps)(InterventionsReport);
