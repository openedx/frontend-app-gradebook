import PropTypes from 'prop-types';

import { Form } from '@openedx/paragon';

const PercentGroup = ({
  id,
  label,
  value,
  disabled,
  max,
  onChange,
}) => (
  <div className="percent-group">
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="number"
        min={0}
        max={max}
        step={1}
        {...{ value, disabled, onChange }}
      />
    </Form.Group>
    <span className="input-percent-label">%</span>
  </div>
);
PercentGroup.defaultProps = {
  disabled: false,
  max: 100,
};
PercentGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  max: PropTypes.number,
};

export default PercentGroup;
