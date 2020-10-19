/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatefulButton } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

import {
  downloadBulkGradesReport,
  downloadInterventionReport,
} from '../../data/actions/grades';

export class BulkManagementControls extends React.Component {
  handleClickDownloadInterventions = () => {
    this.props.downloadInterventionReport(this.props.courseId);
    window.location = this.props.interventionExportUrl;
  };

  // At present, we don't store label and value in google analytics. By setting the label
  // property of the below events, I want to verify that we can set the label of google anlatyics
  // The following properties of a google analytics event are:
  // category (used), name(used), lavel(not used), value(not used)
  handleClickExportGrades = () => {
    this.props.downloadBulkGradesReport(this.props.courseId);
    window.location = this.props.gradeExportUrl;
  };

  render() {
    return (
      <div>
        <StatefulButton
          variant="outline-primary"
          onClick={this.handleClickExportGrades}
          state={this.props.showSpinner ? 'pending' : 'default'}
          labels={{
            default: 'Bulk Management',
            pending: 'Bulk Management',
          }}
          icons={{
            default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
            pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
          }}
          disabledStates={['pending']}
        />
        <StatefulButton
          variant="outline-primary"
          onClick={this.handleClickDownloadInterventions}
          state={this.props.showSpinner ? 'pending' : 'default'}
          className="ml-2"
          labels={{
            default: 'Interventions*',
            pending: 'Interventions*',
          }}
          icons={{
            default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
            pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
          }}
          disabledStates={['pending']}
        />
      </div>
    );
  }
}

BulkManagementControls.defaultProps = {
  courseId: '',
  showSpinner: false,
};

BulkManagementControls.propTypes = {
  courseId: PropTypes.string,
  gradeExportUrl: PropTypes.string.isRequired,
  interventionExportUrl: PropTypes.string.isRequired,
  showSpinner: PropTypes.bool,

  // redux
  downloadBulkGradesReport: PropTypes.func.isRequired,
  downloadInterventionReport: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({ });

export const mapDispatchToProps = {
  downloadBulkGradesReport,
  downloadInterventionReport,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagementControls);
