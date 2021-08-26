import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import messages from './messages';

export class PageButtons extends React.Component {
  constructor(props) {
    super(props);
    this.getPrevGrades = this.getPrevGrades.bind(this);
    this.getNextGrades = this.getNextGrades.bind(this);
  }

  getPrevGrades() {
    this.props.getPrevNextGrades(this.props.prevPage);
  }

  getNextGrades() {
    this.props.getPrevNextGrades(this.props.nextPage);
  }

  render() {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ paddingBottom: '20px' }}
      >
        <Button
          style={{ margin: '20px' }}
          variant="outline-primary"
          disabled={!this.props.prevPage}
          onClick={this.getPrevGrades}
        >
          <FormattedMessage {...messages.prevPage} />
        </Button>
        <Button
          style={{ margin: '20px' }}
          variant="outline-primary"
          disabled={!this.props.nextPage}
          onClick={this.getNextGrades}
        >
          <FormattedMessage {...messages.nextPage} />
        </Button>
      </div>
    );
  }
}

PageButtons.defaultProps = {
  nextPage: '',
  prevPage: '',
};

PageButtons.propTypes = {
  // redux
  getPrevNextGrades: PropTypes.func.isRequired,
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  nextPage: selectors.grades.nextPage(state),
  prevPage: selectors.grades.prevPage(state),
});

export const mapDispatchToProps = {
  getPrevNextGrades: thunkActions.grades.fetchPrevNextGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageButtons);
