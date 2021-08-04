import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Icon, SearchField } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import messages from './messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export class SearchControls extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  /** Changing the search value stores the key in Gradebook. Currently unused */
  onChange(searchValue) {
    this.props.setSearchValue(searchValue);
  }

  onClear() {
    this.props.setSearchValue('');
    this.props.fetchGrades();
  }

  render() {
    return (
      <>
        <h4><FormattedMessage {...messages.filterStepHeading} /></h4>
        <div className="d-flex justify-content-between">
          <Button
            id="edit-filters-btn"
            className="btn-primary align-self-start"
            onClick={this.props.toggleFilterDrawer}
          >
            <Icon className="fa fa-filter" /> <FormattedMessage {...messages.editFilters} />
          </Button>
          <div>
            <SearchField
              onSubmit={this.props.fetchGrades}
              inputLabel={<FormattedMessage {...messages.searchLabel} />}
              onChange={this.onChange}
              onClear={this.onClear}
              value={this.props.searchValue}
            />
            <small className="form-text text-muted search-help-text">
              <FormattedMessage {...messages.searchHint} />
            </small>
          </div>
        </div>
      </>
    );
  }
}

SearchControls.propTypes = {
  // From Redux
  fetchGrades: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  toggleFilterDrawer: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  searchValue: selectors.app.searchValue(state),
});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  setSearchValue: actions.app.setSearchValue,
  toggleFilterDrawer: thunkActions.app.filterMenu.toggle,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchControls);
