import React from 'react';
import PropTypes from 'prop-types';

import initialFilters from 'data/constants/filters';

import FilterBadge from './FilterBadge';

const SingleValueFilterBadge = ({
  displayName, filterName, filterValue, handleBadgeClose, showValue,
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
