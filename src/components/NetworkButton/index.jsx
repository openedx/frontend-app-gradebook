import PropTypes from 'prop-types';
import classNames from 'classnames';

import { StatefulButton, Icon } from '@openedx/paragon';
import { FormattedMessage } from '@openedx/frontend-base';

import { useShouldShowSpinner } from '@src/components/GradesView/data/hooks';
import { StrictDict } from '@src/utils';

export const buttonStates = StrictDict({
  pending: 'pending',
  default: 'default',
});

/**
 * <NetworkButton />
 * Simplified Download/Upload button, tied to the app's network status (showSpinner).
 * Provides a button with a default `download` icon along with a label, which should
 * be a transifex-friendly message object. If the `import` argument is passed, the default
 * icon will be an upload icon.
 * If the app is busy on a network task (showSpinner === true), the button will be disabled
 * and show a spinner/working indicator.
 * The buttons can also be passed an optional className for further css customization.
 * @param {string} className - optional extra css class(es)
 * @param {object} label - transifex-friendly message object
 * @param {func} onClick - button on-click action
 * @param {bool} import - should show import icon instead of download icon in default state.
 */
export const NetworkButton = ({
  className,
  label,
  onClick,
  import: isImport,
}) => {
  const showSpinner = useShouldShowSpinner();

  const labelNode = <FormattedMessage {...label} />;
  const labels = { default: labelNode, pending: labelNode };

  const iconClass = 'fa mr-2';
  const defaultIcon = isImport ? 'fa-upload' : 'fa-download';
  const icons = {
    pending: (<Icon className={classNames(iconClass, 'fa-spinner fa-spin')} />),
    default: (<Icon className={classNames(iconClass, defaultIcon)} />),
  };

  const buttonState = showSpinner ? buttonStates.pending : buttonStates.default;

  return (
    <StatefulButton
      labels={labels}
      variant="outline-primary"
      disabledStates={[buttonStates.pending]}
      className={classNames('ml-2', className)}
      icons={icons}
      state={buttonState}
      onClick={onClick}
    />
  );
};

NetworkButton.defaultProps = {
  className: '',
  import: false,
};

NetworkButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  import: PropTypes.bool,
};

export default NetworkButton;
