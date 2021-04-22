import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Icon, SearchField } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import {
  fetchGrades,
  fetchMatchingUserGrades,
} from '../../data/actions/grades';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export class SearchControls extends React.Component {
  onSubmit = value => {
    this.props.searchForUser(
      this.props.courseId,
      value,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  }

  onChange = (filterValue) => {
    this.props.setGradebookState({ filterValue });
  }

  onClear = () => {
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  }

  render() {
    return (
      <>
        <h4>Step 1: Filter the Grade Report</h4>
        <div className="d-flex justify-content-between">
          {this.props.showSpinner && <div className="spinner-overlay"><Icon className="fa fa-spinner fa-spin fa-5x color-black" /></div>}
          <Button className="btn-primary align-self-start" onClick={this.props.toggleFilterDrawer}><FontAwesomeIcon icon={faFilter} /> Edit Filters</Button>
          <div>
            <SearchField
              onSubmit={this.onSubmit}
              inputLabel="Search for a learner"
              onChange={this.onChange}
              onClear={this.onClear}
              value={this.props.filterValue}
            />
            <small className="form-text text-muted search-help-text">Search by username, email, or student key</small>
          </div>
        </div>
      </>
    );
  }
}

SearchControls.defaultProps = {
  courseId: '',
  filterValue: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
  showSpinner: false,
};

SearchControls.propTypes = {
  courseId: PropTypes.string,
  filterValue: PropTypes.string,
  setGradebookState: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool,
  toggleFilterDrawer: PropTypes.func.isRequired,
  // From Redux
  getUserGrades: PropTypes.func.isRequired,
  searchForUser: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  selectedAssignmentType: state.filters.assignmentType,
  selectedTrack: state.filters.track,
  selectedCohort: state.filters.cohort,
});

export const mapDispatchToProps = {
  getUserGrades: fetchGrades,
  searchForUser: fetchMatchingUserGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControls);
