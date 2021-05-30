import React from 'react';
import PropTypes from 'prop-types';

import initialFilters from 'data/constants/filters';

import FilterBadge from './FilterBadge';

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
