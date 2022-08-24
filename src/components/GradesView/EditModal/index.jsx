/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Modal,
  Alert,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import messages from './messages';
import OverrideTable from './OverrideTable';
import ModalHeaders from './ModalHeaders';

/**
 * <EditModal />
 * Wrapper component for the modal that allows editing the grade for an individual
 * unit, for a given student.
 * Provides a StatusAlert with override fetch errors if any are found, an OverrideTable
 * (with appropriate headers) for managing the actual override, and a submit button for
 * adjusting the grade.
 * (also provides a close button that clears the modal state)
 */
export class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.closeAssignmentModal = this.closeAssignmentModal.bind(this);
    this.handleAdjustedGradeClick = this.handleAdjustedGradeClick.bind(this);
  }

  closeAssignmentModal() {
    this.props.doneViewingAssignment();
    this.props.closeModal();
  }

  handleAdjustedGradeClick() {
    this.props.updateGrades();
    this.closeAssignmentModal();
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        title={<FormattedMessage {...messages.title} />}
        closeText={<FormattedMessage {...messages.closeText} />}
        body={(
          <div>
            <ModalHeaders />
            <Alert
              variant="danger"
              show={!!this.props.gradeOverrideHistoryError}
              dismissible={false}
            >
              {this.props.gradeOverrideHistoryError}
            </Alert>
            <OverrideTable />
            <div><FormattedMessage {...messages.visibility} /></div>
            <div><FormattedMessage {...messages.saveVisibility} /></div>
          </div>
        )}
        buttons={[
          <Button variant="primary" onClick={this.handleAdjustedGradeClick}>
            <FormattedMessage {...messages.saveGrade} />
          </Button>,
        ]}
        onClose={this.closeAssignmentModal}
      />
    );
  }
}

EditModal.defaultProps = {
  gradeOverrideHistoryError: '',
};

EditModal.propTypes = {
  // redux
  gradeOverrideHistoryError: PropTypes.string,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  doneViewingAssignment: PropTypes.func.isRequired,
  updateGrades: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradeOverrideHistoryError: selectors.grades.gradeOverrideHistoryError(state),
  open: selectors.app.modalState.open(state),
});

export const mapDispatchToProps = {
  closeModal: actions.app.closeModal,
  doneViewingAssignment: actions.grades.doneViewingAssignment,
  updateGrades: thunkActions.grades.updateGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
