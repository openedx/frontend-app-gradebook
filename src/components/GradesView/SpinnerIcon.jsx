import React from 'react';

import { Spinner } from '@openedx/paragon';

import { selectors } from '../../data/redux/hooks';
import { useGradesViewSpinnerMessages } from './hooks';

/**
 * <SpinnerIcon />
 * Simmple redux-connected icon component that shows a spinner overlay only if
 * redux state says it should.
 */
export const SpinnerIcon = () => {
  const { spinnerScreenReaderText } = useGradesViewSpinnerMessages();
  const show = selectors.root.useShouldShowSpinner();
  return show && (
    <div className="spinner-overlay">
      <Spinner
        animation="border"
        className="mie-3 color-black"
        screenReaderText={spinnerScreenReaderText}
      />
    </div>
  );
};
SpinnerIcon.propTypes = {};

export default SpinnerIcon;
