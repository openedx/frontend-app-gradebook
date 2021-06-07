/* eslint-disable react/sort-comp, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Icon,
  IconButton,
} from '@edx/paragon';
import { Close } from '@edx/paragon/icons';

import thunkActions from 'data/thunkActions';

export const GradebookFiltersHeader = ({ closeMenu }) => (
  <>
    <h2><Icon className="fa fa-filter" /></h2>
    <IconButton
      className="p-1"
      onClick={closeMenu}
      iconAs={Icon}
      src={Close}
      alt="Close Filters"
      aria-label="Close Filters"
    />
  </>
);
GradebookFiltersHeader.propTypes = {
  // redux
  closeMenu: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  closeMenu: thunkActions.app.filterMenu.close,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookFiltersHeader);
