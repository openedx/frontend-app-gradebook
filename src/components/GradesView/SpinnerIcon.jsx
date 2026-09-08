import { Icon } from '@openedx/paragon';

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
      <Icon className="fa fa-spinner fa-spin fa-5x color-black" />
    </div>
  );
};
SpinnerIcon.propTypes = {};

export default SpinnerIcon;
