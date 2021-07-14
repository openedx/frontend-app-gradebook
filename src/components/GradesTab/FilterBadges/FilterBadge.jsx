import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';

/**
 * FilterBadge
 * Base filter badge component, that displays a name and a close button.
 * If showValue is true, it will also display the included value.
 * @param {func} handleClose - close/dismiss filter event, taking a list of filternames
 *   to reset when the filter badge closes.
 * @param {string} filterName - api filter name (for redux connector)
 */
export const FilterBadge = ({
  config: {
    displayName,
    isDefault,
    hideValue,
    value,
    connectedFilters,
  },
  handleClose,
}) => !isDefault && (
  <div>
    <span className="badge badge-info">
      <span>
        <FormattedMessage {...displayName} />
      </span>
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

FilterBadge.propTypes = {
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line
  filterName: PropTypes.string.isRequired,
  // redux
  config: PropTypes.shape({
    connectedFilters: PropTypes.arrayOf(PropTypes.string),
    displayName: PropTypes.shape({
      defaultMessage: PropTypes.string,
    }).isRequired,
    isDefault: PropTypes.bool.isRequired,
    hideValue: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
};

export const mapStateToProps = (state, ownProps) => ({
  config: selectors.root.filterBadgeConfig(state, ownProps.filterName),
});

export default connect(mapStateToProps)(FilterBadge);
