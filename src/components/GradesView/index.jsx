/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import PageButtons from './PageButtons';
import FilterBadges from './FilterBadges';

import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import GradebookTable from './GradebookTable';
import SearchControls from './SearchControls';
import StatusAlerts from './StatusAlerts';
import SpinnerIcon from './SpinnerIcon';
import ScoreViewInput from './ScoreViewInput';
import UsersLabel from './UsersLabel';
import messages from './messages';

export class GradesTab extends React.Component {
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
        <SearchControls />
        <FilterBadges handleClose={this.handleFilterBadgeClose} />
        <StatusAlerts />

        <h4><FormattedMessage {...messages.gradebookStepHeading} /></h4>
        <UsersLabel />

        <div className="d-flex justify-content-between align-items-center mb-2">
          <ScoreViewInput />
          <BulkManagementControls />
        </div>

        <GradebookTable />

        <PageButtons />
        <p>* <FormattedMessage {...messages.mastersHint} /></p>
        <EditModal />
      </>
    );
  }
}

GradesTab.defaultProps = {};

GradesTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(GradesTab);
