/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { Button } from '@edx/paragon';

import thunkActions from 'data/thunkActions';

class GradeButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.setModalState({
      userEntry: this.props.entry,
      subsection: this.props.subsection,
    });
  }

  render() {
    return (
      <Button
        variant="link"
        className={classNames(
          'btn-header',
          'grade-button',
        )}
        onClick={this.onClick}
      >
        {this.props.label}
      </Button>
    );
  }
}

GradeButton.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  subsection: PropTypes.shape({
    attempted: PropTypes.bool,
    percent: PropTypes.number,
    score_possible: PropTypes.number,
    subsection_name: PropTypes.string,
    module_id: PropTypes.string,
  }).isRequired,
  entry: PropTypes.shape({
    user_id: PropTypes.number,
    username: PropTypes.string,
  }).isRequired,
  // redux
  setModalState: PropTypes.func.isRequired,
};

export const mapDispatchToProps = {
  setModalState: thunkActions.app.setModalStateFromTable,
};

export default connect(() => ({}), mapDispatchToProps)(GradeButton);
