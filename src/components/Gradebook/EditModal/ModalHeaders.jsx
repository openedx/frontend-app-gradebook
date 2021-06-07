import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'data/selectors';

const HistoryHeader = ({ id, label, value }) => (
  <div>
    <div className={`grade-history-header grade-history-${id}`}>{label}: </div>
    <div>{value}</div>
  </div>
);
HistoryHeader.defaultProps = {
  value: null,
};
HistoryHeader.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const ModalHeaders = ({
  modalState,
  originalGrade,
  currentGrade,
}) => (
  <div>
    <HistoryHeader
      id="assignment"
      label="Assignment"
      value={modalState.assignmentName}
    />
    <HistoryHeader
      id="student"
      label="Student"
      value={modalState.updateUserName}
    />
    <HistoryHeader
      id="original-grade"
      label="Original Grade"
      value={originalGrade}
    />
    <HistoryHeader
      id="current-grade"
      label="Current Grade"
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
  editUpdateData: selectors.app.editUpdateData(state),
  modalState: {
    assignmentName: selectors.app.modalState.assignmentName(state),
    updateUserName: selectors.app.modalState.updateUserName(state),
  },
  currentGrade: selectors.grades.gradeOverrideCurrentEarnedGradedOverride(state),
  originalGrade: selectors.grades.gradeOriginalEarnedGraded(state),
});

export default connect(mapStateToProps)(ModalHeaders);
