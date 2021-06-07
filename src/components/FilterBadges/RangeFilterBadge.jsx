import React from 'react';
import PropTypes from 'prop-types';

import initialFilters from 'data/constants/filters';

import FilterBadge from './FilterBadge';

/**
 * RangeFilterBadge
 * Simple override to base FilterBadge component for range-value types.
 * Only displays if either filter is not at its default value
 * @param {string} displayName - string to display as filter name
 * @param {string} filterName1 - 1st filter name/key in the data model
 * @param {string/bool} filterValue1 - 1st filterValue
 * @param {string} filterName2 - 2nd filter name/key in the data model
 * @param {string/bool} filterValue2 - 2nd filterValue
 * @param {func} handleBadgeClose - filter close/reset event
 */
const RangeFilterBadge = ({
  displayName,
  filterName1,
  filterValue1,
  filterName2,
  filterValue2,
  handleBadgeClose,
}) => (
  (
    (filterValue1 !== initialFilters[filterName1])
    || (filterValue2 !== initialFilters[filterName2])
  ) && (
    <FilterBadge
      name={displayName}
      value={`${filterValue1} - ${filterValue2}`}
      onClick={handleBadgeClose}
    />
  )
);
RangeFilterBadge.propTypes = {
  displayName: PropTypes.string.isRequired,
  filterName1: PropTypes.string.isRequired,
  filterValue1: PropTypes.string.isRequired,
  filterName2: PropTypes.string.isRequired,
  filterValue2: PropTypes.string.isRequired,
  handleBadgeClose: PropTypes.func.isRequired,
};

export default RangeFilterBadge;
