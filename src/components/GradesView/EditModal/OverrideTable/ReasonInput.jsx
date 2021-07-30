import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import selectors from 'data/selectors';
import actions from 'data/actions';

/**
 * <ReasonInput />
 * Input control for the "reason for change" field in the Edit modal.
 */
export class ReasonInput extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.ref.current.focus();
  }

  onChange = (event) => {
    this.props.setModalState({ reasonForChange: event.target.value });
  };

  render() {
    return (
      <Form.Control
        type="text"
        name="reasonForChange"
        value={this.props.value}
        onChange={this.onChange}
        ref={this.ref}
      />
    );
  }
}
ReasonInput.propTypes = {
  // redux
  setModalState: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  value: selectors.app.modalState.reasonForChange(state),
});

export const mapDispatchToProps = {
  setModalState: actions.app.setModalState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReasonInput);
