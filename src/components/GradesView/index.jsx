/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import FilterBadges from './FilterBadges';
import FilteredUsersLabel from './FilteredUsersLabel';
import FilterMenuToggle from './FilterMenuToggle';
import GradebookTable from './GradebookTable';
import ImportSuccessToast from './ImportSuccessToast';
import InterventionsReport from './InterventionsReport';
import PageButtons from './PageButtons';
import ScoreViewInput from './ScoreViewInput';
import SearchControls from './SearchControls';
import SpinnerIcon from './SpinnerIcon';
import StatusAlerts from './StatusAlerts';
import messages from './messages';

export class GradesView extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterBadgeClose = this.handleFilterBadgeClose.bind(this);
  }

  handleFilterBadgeClose(filterNames) {
    return () => {
      this.props.resetFilters(filterNames);
      this.props.updateQueryParams(filterNames.reduce(
        (obj, filterName) => ({ ...obj, [filterName]: false }),
        {},
      ));
      this.props.fetchGrades();
    };
  }

  render() {
    return (
      <>
        <SpinnerIcon />

        <InterventionsReport />
        <h4 className="step-message-1">
          <FormattedMessage {...messages.filterStepHeading} />
        </h4>

        <div className="d-flex justify-content-between">
          <FilterMenuToggle />
          <SearchControls />
        </div>

        <FilterBadges handleClose={this.handleFilterBadgeClose} />
        <StatusAlerts />

        <h4><FormattedMessage {...messages.gradebookStepHeading} /></h4>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <ScoreViewInput />
          <BulkManagementControls />
        </div>

        <FilteredUsersLabel />

        <GradebookTable />

        <PageButtons />
        <p>* <FormattedMessage {...messages.mastersHint} /></p>
        <EditModal />

        <ImportSuccessToast />
      </>
    );
  }
}

GradesView.defaultProps = {};

GradesView.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  fetchGrades: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  resetFilters: actions.filters.reset,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradesView);
