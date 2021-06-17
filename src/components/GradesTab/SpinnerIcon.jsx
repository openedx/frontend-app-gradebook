/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon } from '@edx/paragon';

import selectors from 'data/selectors';

/**
 * <SpinnerIcon />
 * Simmple redux-connected icon component that shows a spinner overlay only if
 * redux state says it should.
 */
export const SpinnerIcon = ({ show }) => show && (
  <div className="spinner-overlay">
    <Icon className="fa fa-spinner fa-spin fa-5x color-black" />
  </div>
);
SpinnerIcon.defaultProps = {
  show: false,
};
SpinnerIcon.propTypes = {
  show: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  show: selectors.root.shouldShowSpinner(state),
});

export default connect(mapStateToProps)(SpinnerIcon);
