import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux/hooks';

/**
 * FilterBadge
 * Base filter badge component, that displays a name and a close button.
 * If showValue is true, it will also display the included value.
 * @param {func} handleClose - close/dismiss filter event, taking a list of filternames
 *   to reset when the filter badge closes.
 * @param {string} filterName - api filter name (for redux connector)
 */
export const FilterBadge = ({
  filterName,
  handleClose,
}) => {
  const { formatMessage } = useIntl();
  const {
    displayName,
    isDefault,
    hideValue,
    value,
    connectedFilters,
  } = selectors.root.useFilterBadgeConfig(filterName);
  if (isDefault) {
    return null;
  }
  return (
    <div>
      <span className="badge badge-info">
        <span>{formatMessage(displayName)}</span>
        <span>
          {!hideValue ? `: ${value}` : ''}
        </span>
        <Button
          className="btn-info"
          aria-label="close"
          onClick={handleClose(connectedFilters)}
        >
          <span aria-hidden="true">&times;</span>
        </Button>
      </span>
      <br />
    </div>
  );
};

FilterBadge.propTypes = {
  handleClose: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
};

export default FilterBadge;
