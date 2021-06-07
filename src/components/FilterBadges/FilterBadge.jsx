import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@edx/paragon';

/**
 * FilterBadge
 * Base filter badge component, that displays a name and a close button.
 * If showValue is true, it will also display the included value.
 * @param {string} name - filter name
 * @param {bool/string} value - filter value
 * @param {func} onClick - close/dismiss filter event
 * @param {bool} showValue - should the Value be displayed instead of just name?
 */
const FilterBadge = ({
  name, value, onClick, showValue,
}) => (
  <div>
    <span className="badge badge-info">
      <span>
        {name}{showValue && `: ${value}`}
      </span>
      <Button
        className="btn-info"
        aria-label="close"
        onClick={onClick}
      >
        <span aria-hidden="true">&times;</span>
      </Button>
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
