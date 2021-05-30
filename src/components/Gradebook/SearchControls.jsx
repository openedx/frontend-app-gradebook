import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Icon, SearchField } from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export class SearchControls extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  /** Changing the search value stores the key in Gradebook. Currently unused */
  onChange(searchValue) {
    this.props.setSearchValue(searchValue);
  }

  render() {
    return (
      <>
        <h4>Step 1: Filter the Grade Report</h4>
        <div className="d-flex justify-content-between">
          <Button
            id="edit-filters-btn"
            className="btn-primary align-self-start"
            onClick={this.props.toggleFilterDrawer}
          >
            <Icon className="fa fa-filter" /> Edit Filters
          </Button>
          <div>
            <SearchField
              onSubmit={this.props.fetchGrades}
              inputLabel="Search for a learner"
              onChange={this.onChange}
              onClear={this.props.fetchGrades}
              value={this.props.searchValue}
            />
            <small className="form-text text-muted search-help-text">
              Search by username, email, or student key
            </small>
          </div>
        </div>
      </>
    );
  }
}

SearchControls.propTypes = {
  toggleFilterDrawer: PropTypes.func.isRequired,
  // From Redux
  fetchGrades: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  searchValue: selectors.app.searchValue(state),
});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  setSearchValue: actions.app.setSearchValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControls);
