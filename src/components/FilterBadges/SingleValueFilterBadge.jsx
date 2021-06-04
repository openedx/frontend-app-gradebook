import React from 'react';
import PropTypes from 'prop-types';

import initialFilters from 'data/constants/filters';

import FilterBadge from './FilterBadge';

/**
 * SingleValueFilterBadge
 * Simple override to base FilterBadge component for single-value filter types
 * Only displays if the filter is not at its default value
 * @param {string} displayName - string to display as filter name
 * @param {string} filterName - filter name/key in the data model
 * @param {string/bool} filterValue - filterValue
 * @param {func} handleBadgeClose - filter close/reset event
 * @param {bool} showValue - should show value string?
 */
const SingleValueFilterBadge = ({
  displayName,
  filterName,
  filterValue,
  handleBadgeClose,
  showValue,
}) => (
  (filterValue !== initialFilters[filterName]) && (
    <FilterBadge
      name={displayName}
      value={filterValue}
      onClick={handleBadgeClose}
      showValue={showValue}
    />
  )
);
SingleValueFilterBadge.defaultProps = {
  showValue: true,
};
SingleValueFilterBadge.propTypes = {
  displayName: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  filterValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  handleBadgeClose: PropTypes.func.isRequired,
  showValue: PropTypes.bool,
};

export default SingleValueFilterBadge;
