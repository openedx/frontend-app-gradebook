import React from 'react';
import PropTypes from 'prop-types';

const FilterBadge = ({
  name, value, onClick, showValue,
}) => (
  <div>
    <span className="badge badge-info">
      <span>{name}{showValue && `: ${value}`}</span>
      <button type="button" className="btn-info" aria-label="Close" onClick={onClick}>
        <span aria-hidden="true">&times;</span>
      </button>
    </span>
    <br />
  </div>
);
FilterBadge.defaultProps = {
  showValue: true,
};
FilterBadge.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  showValue: PropTypes.bool,
};

export default FilterBadge;
