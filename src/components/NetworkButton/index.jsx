/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { StatefulButton, Icon } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import { StrictDict } from 'utils';

export const buttonStates = StrictDict({
  pending: 'pending',
  default: 'default',
});

/**
 * <NetworkButton />
 * Simplified Download/Upload button, tied to the app's network status (showSpinner).
 * Provides a button with a default `download` icon along with a label, which should
 * be a transifex-friendly message object.  If the `import` argument is passed, the default
 * icon will be an upload icon.
 * If the app is busy on a network task (showSpinner === true), the button will be disabled
 * and show a spinner/working indicator.
 * The buttons can also be passed an optional className for further css customization.
 * @param {string} className - optional extra css class(es)
 * @param {object} label - transifex-friendly message object
 * @param {func} onClick - button on-click action
 * @param {bool} import - should show import icon instead of download icon in default state.
 */
export class NetworkButton extends React.Component {
  get labels() {
    const label = <FormattedMessage {...this.props.label} />;
    return { default: label, pending: label };
  }

  get icons() {
    const iconClass = 'fa mr-2';
    const defaultIcon = this.props.import ? 'fa-upload' : 'fa-download';
    return {
      pending: (<Icon className={classNames(iconClass, 'fa-spinner fa-spin')} />),
      default: (<Icon className={classNames(iconClass, defaultIcon)} />),
    };
  }

  get buttonState() {
    return this.props.showSpinner ? buttonStates.pending : buttonStates.default;
  }

  render() {
    return (
      <StatefulButton
        labels={this.labels}
        variant="outline-primary"
        disabledStates={[buttonStates.pending]}
        className={classNames('ml-2', this.props.className)}
        icons={this.icons}
        state={this.buttonState}
        onClick={this.props.onClick}
      />
    );
  }
}

NetworkButton.defaultProps = {
  className: '',
  showSpinner: false,
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
  // redux
  showSpinner: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  showSpinner: selectors.root.shouldShowSpinner(state),
});
export default connect(mapStateToProps)(NetworkButton);
