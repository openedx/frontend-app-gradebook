import { Spinner } from '@openedx/paragon';

import { useShouldShowSpinner } from './data/hooks';

/**
 * <SpinnerIcon />
 * Simple icon component that shows a spinner overlay only while the app is busy
 * (grades fetching or a mutation in flight).
 */
export const SpinnerIcon = () => {
  const show = useShouldShowSpinner();
  return show && (
    <div className="spinner-overlay">
      <Spinner animation="border" variant="dark" screenReaderText="loading" />
    </div>
  );
};
SpinnerIcon.propTypes = {};

export default SpinnerIcon;
