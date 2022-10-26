import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Icon } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import thunkActions from 'data/thunkActions';

import messages from './FilterMenuToggle.messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const FilterMenuToggle = ({ toggleFilterDrawer }) => (
  <Button
    id="edit-filters-btn"
    className="btn-primary align-self-start"
    onClick={toggleFilterDrawer}
  >
    <Icon className="fa fa-filter" /> <FormattedMessage {...messages.editFilters} />
  </Button>
);

FilterMenuToggle.propTypes = {
  // From Redux
  toggleFilterDrawer: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  toggleFilterDrawer: thunkActions.app.filterMenu.toggle,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterMenuToggle);
