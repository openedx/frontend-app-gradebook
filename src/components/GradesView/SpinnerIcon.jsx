import React from 'react';

import { Icon } from '@edx/paragon';

import { selectors } from 'data/redux/hooks';

/**
 * <SpinnerIcon />
 * Simmple redux-connected icon component that shows a spinner overlay only if
 * redux state says it should.
 */
export const SpinnerIcon = () => {
  const show = selectors.root.useShouldShowSpinner();
  return show && (
    <div className="spinner-overlay">
      <Icon className="fa fa-spinner fa-spin fa-5x color-black" />
    </div>
  );
};
SpinnerIcon.propTypes = {};

export default SpinnerIcon;
