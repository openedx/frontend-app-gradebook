import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';

import messages from './messages';
import HistoryHeader from './HistoryHeader';

/**
 * <ModalHeaders />
 * Provides a list of HistoryHeaders for the student name, assignment,
 * original grade, and current override grade.
 */
export const ModalHeaders = ({
  modalState,
  originalGrade,
  currentGrade,
}) => (
  <div>
    <HistoryHeader
      label={<FormattedMessage {...messages.assignmentHeader} />}
      value={modalState.assignmentName}
    />
    <HistoryHeader
      label={<FormattedMessage {...messages.studentHeader} />}
      value={modalState.updateUserName}
    />
    <HistoryHeader
      label={<FormattedMessage {...messages.originalGradeHeader} />}
      value={originalGrade}
    />
    <HistoryHeader
      label={<FormattedMessage {...messages.currentGradeHeader} />}
      value={currentGrade}
    />
  </div>
);
ModalHeaders.defaultProps = {
  currentGrade: null,
  originalGrade: null,
};
ModalHeaders.propTypes = {
  // redux
  currentGrade: PropTypes.number,
  originalGrade: PropTypes.number,
  modalState: PropTypes.shape({
    assignmentName: PropTypes.string.isRequired,
    updateUserName: PropTypes.string,
  }).isRequired,
};

export const mapStateToProps = (state) => ({
  modalState: {
    assignmentName: selectors.app.modalState.assignmentName(state),
    updateUserName: selectors.app.modalState.updateUserName(state),
  },
  currentGrade: selectors.grades.gradeOverrideCurrentEarnedGradedOverride(state),
  originalGrade: selectors.grades.gradeOriginalEarnedGraded(state),
});

export default connect(mapStateToProps)(ModalHeaders);
