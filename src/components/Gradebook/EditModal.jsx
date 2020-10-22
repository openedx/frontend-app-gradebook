/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Modal,
  StatusAlert,
  Table,
} from '@edx/paragon';

import {
  doneViewingAssignment,
  updateGrades,
} from '../../data/actions/grades';

const GRADE_OVERRIDE_HISTORY_COLUMNS = [{ label: 'Date', key: 'date' }, { label: 'Grader', key: 'grader' },
  { label: 'Reason', key: 'reason' },
  { label: 'Adjusted grade', key: 'adjustedGrade' }];

export class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.overrideReasonInput = React.createRef();
  }

  componentDidMount() {
    this.overrideReasonInput.current.focus();
  }

  handleAdjustedGradeClick = () => {
    this.props.updateGrades(
      this.props.courseId, [
        {
          user_id: this.props.updateUserId,
          usage_id: this.props.updateModuleId,
          grade: {
            earned_graded_override: this.props.adjustedGradeValue,
            comment: this.props.reasonForChange,
          },
        },
      ],
      this.props.filterValue,
      this.props.selectedCohort,
      this.props.selectedTrack,
    );

    this.closeAssignmentModal();
  }

  closeAssignmentModal = () => {
    this.props.doneViewingAssignment();
    this.props.setGradebookState({
      adjustedGradePossible: '',
      adjustedGradeValue: '',
      modalOpen: false,
      reasonForChange: '',
      updateModuleId: null,
      updateUserId: null,
    });
  };

  render() {
    return (
      <Modal
        open={this.props.open}
        title="Edit Grades"
        closeText="Cancel"
        body={(
          <div>
            <div>
              <div className="grade-history-header grade-history-assignment">Assignment: </div>
              <div>{this.props.assignmentName}</div>
              <div className="grade-history-header grade-history-student">Student: </div>
              <div>{this.props.updateUserName}</div>
              <div className="grade-history-header grade-history-original-grade">Original Grade: </div>
              <div>{this.props.gradeOriginalEarnedGraded}</div>
              <div className="grade-history-header grade-history-current-grade">Current Grade: </div>
              <div>{this.props.gradeOverrideCurrentEarnedGradedOverride}</div>
            </div>
            <StatusAlert
              alertType="danger"
              dialog={this.props.gradeOverrideHistoryError}
              open={!!this.props.gradeOverrideHistoryError}
              dismissible={false}
            />
            {!this.props.gradeOverrideHistoryError && (
              <Table
                columns={GRADE_OVERRIDE_HISTORY_COLUMNS}
                data={[...this.props.gradeOverrides, {
                  date: this.props.todaysDate,
                  reason: (<input
                    type="text"
                    name="reasonForChange"
                    value={this.props.reasonForChange}
                    onChange={this.props.setReasonForChange}
                    ref={this.overrideReasonInput}
                  />),
                  adjustedGrade: (
                    <span>
                      <input
                        type="text"
                        name="adjustedGradeValue"
                        value={this.props.adjustedGradeValue}
                        onChange={this.props.setAdjustedGradeValue}
                      />
                      {(this.props.adjustedGradePossible || this.props.gradeOriginalPossibleGraded) && ' / '}
                      {this.props.adjustedGradePossible || this.props.gradeOriginalPossibleGraded}
                    </span>),
                }]}
              />
            )}

            <div>Showing most recent actions (max 5). To see more, please contact
              support.
            </div>
            <div>Note: Once you save, your changes will be visible to students.</div>
          </div>
        )}
        buttons={[
          <Button
            variant="primary"
            onClick={this.handleAdjustedGradeClick}
          >
            Save Grade
          </Button>,
        ]}
        onClose={this.closeAssignmentModal}
      />
    );
  }
}

EditModal.defaultProps = {
  adjustedGradeValue: null,
  courseId: '',
  gradeOverrideCurrentEarnedGradedOverride: null,
  gradeOverrideHistoryError: '',
  gradeOverrides: [],
  gradeOriginalEarnedGraded: null,
  gradeOriginalPossibleGraded: null,
  selectedCohort: null,
  selectedTrack: null,
  updateModuleId: '',
  updateUserId: '',
  updateUserName: '',
};

EditModal.propTypes = {
  courseId: PropTypes.string,

  // Gradebook State
  adjustedGradePossible: PropTypes.string.isRequired,
  // should pick one?
  adjustedGradeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  assignmentName: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  reasonForChange: PropTypes.string.isRequired,
  todaysDate: PropTypes.string.isRequired,
  updateModuleId: PropTypes.string,
  updateUserId: PropTypes.number,
  updateUserName: PropTypes.string,

  // Gradebook State Setters
  setAdjustedGradeValue: PropTypes.func.isRequired,
  setGradebookState: PropTypes.func.isRequired,
  setReasonForChange: PropTypes.func.isRequired,

  // redux
  doneViewingAssignment: PropTypes.func.isRequired,
  gradeOverrideCurrentEarnedGradedOverride: PropTypes.number,
  gradeOverrideHistoryError: PropTypes.string,
  gradeOverrides: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    grader: PropTypes.string,
    reason: PropTypes.string,
    adjustedGrade: PropTypes.number,
  })),
  gradeOriginalEarnedGraded: PropTypes.number,
  gradeOriginalPossibleGraded: PropTypes.number,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  updateGrades: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradeOverrides: state.grades.gradeOverrideHistoryResults,
  gradeOverrideCurrentEarnedGradedOverride: state.grades.gradeOverrideCurrentEarnedGradedOverride,
  gradeOverrideHistoryError: state.grades.gradeOverrideHistoryError,
  gradeOriginalEarnedGraded: state.grades.gradeOriginalEarnedGraded,
  grdaeOriginalPossibleGraded: state.grades.grdaeOriginalPossibleGraded,
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
});

export const mapDispatchToProps = {
  doneViewingAssignment,
  updateGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
