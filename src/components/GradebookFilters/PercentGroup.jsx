/* eslint-disable react/sort-comp */
import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '@edx/paragon';

const PercentGroup = ({
  id,
  label,
  value,
  disabled,
  onChange,
}) => (
  <div className="percent-group">
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="number"
        min={0}
        max={100}
        step={1}
        {...{ value, disabled, onChange }}
      />
    </Form.Group>
    <span className="input-percent-label">%</span>
  </div>
);
PercentGroup.defaultProps = {
  disabled: false,
};
PercentGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default PercentGroup;
