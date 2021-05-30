/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon } from '@edx/paragon';

import selectors from 'data/selectors';

const SpinnerIcon = ({ show }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="spinner-overlay">
      <Icon className="fa fa-spinner fa-spin fa-5x color-black" />
    </div>
  );
};

SpinnerIcon.propTypes = {
  show: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  show: selectors.root.shouldShowSpinner(state),
});

export default connect(mapStateToProps)(SpinnerIcon);
