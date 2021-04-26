/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '@edx/paragon';

const SelectGroup = ({
  id,
  label,
  value,
  onChange,
  disabled,
  options,
}) => (
  <div className="student-filters">
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" {...{ value, onChange, disabled }}>
        {options}
      </Form.Control>
    </Form.Group>
  </div>
);
SelectGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default SelectGroup;
