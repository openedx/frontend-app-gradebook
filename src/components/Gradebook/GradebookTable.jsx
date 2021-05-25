/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Table, OverlayTrigger, Tooltip, Icon,
} from '@edx/paragon';

import { EMAIL_HEADING, TOTAL_COURSE_GRADE_HEADING, USERNAME_HEADING } from 'data/constants/grades';
import selectors from 'data/selectors';
import { formatDateForDisplay } from 'data/actions/utils';
import thunkActions from 'data/thunkActions';

const DECIMAL_PRECISION = 2;

export class GradebookTable extends React.Component {
  setNewModalState = (userEntry, subsection) => {
    this.props.fetchGradeOverrideHistory(
      subsection.module_id,
      userEntry.user_id,
    );

    let adjustedGradePossible = '';
    if (subsection.attempted) {
      adjustedGradePossible = subsection.score_possible;
    }

    this.props.setGradebookState({
      adjustedGradePossible,
      adjustedGradeValue: '',
      assignmentName: `${subsection.subsection_name}`,
      modalOpen: true,
      reasonForChange: '',
      todaysDate: formatDateForDisplay(new Date()),
      updateModuleId: subsection.module_id,
      updateUserId: userEntry.user_id,
      updateUserName: userEntry.username,
    });
  }

  getLearnerInformation = entry => (
    <div>
      <div>{entry.username}</div>
      {entry.external_user_key && <div className="student-key">{entry.external_user_key}</div>}
    </div>
  )

  roundGrade = percent => parseFloat((percent || 0).toFixed(DECIMAL_PRECISION));

  formatter = {
    percent: (entries, areGradesFrozen) => entries.map((entry) => {
      const learnerInformation = this.getLearnerInformation(entry);
      const results = {
        [USERNAME_HEADING]: (
          <div><span className="wrap-text-in-cell">{learnerInformation}</span></div>
        ),
        [EMAIL_HEADING]: (
          <span className="wrap-text-in-cell">{entry.email}</span>
        ),
      };

      const assignments = entry.section_breakdown
        .reduce((acc, subsection) => {
          if (areGradesFrozen) {
            acc[subsection.label] = `${this.roundGrade(subsection.percent * 100)} %`;
          } else {
            acc[subsection.label] = (
              <button
                className="btn btn-header link-style grade-button"
                onClick={() => this.setNewModalState(entry, subsection)}
              >
                {this.roundGrade(subsection.percent * 100)}%
              </button>
            );
          }
          return acc;
        }, {});
      const totals = { [TOTAL_COURSE_GRADE_HEADING]: `${this.roundGrade(entry.percent * 100)}%` };
      return Object.assign(results, assignments, totals);
    }),

    absolute: (entries, areGradesFrozen) => entries.map((entry) => {
      const learnerInformation = this.getLearnerInformation(entry);
      const results = {
        [USERNAME_HEADING]: (
          <div><span className="wrap-text-in-cell">{learnerInformation}</span></div>
        ),
        [EMAIL_HEADING]: (
          <span className="wrap-text-in-cell">{entry.email}</span>
        ),
      };

      const assignments = entry.section_breakdown
        .reduce((acc, subsection) => {
          const scoreEarned = this.roundGrade(subsection.score_earned);
          const scorePossible = this.roundGrade(subsection.score_possible);
          let label = `${scoreEarned}`;
          if (subsection.attempted) {
            label = `${scoreEarned}/${scorePossible}`;
          }
          if (areGradesFrozen) {
            acc[subsection.label] = label;
          } else {
            acc[subsection.label] = (
              <button
                className="btn btn-header link-style"
                onClick={() => this.setNewModalState(entry, subsection)}
              >
                {label}
              </button>
            );
          }
          return acc;
        }, {});

      // Show this as a percent no matter what the other setting is. The data
      // we're getting gives the final grade as a percentage so making it appear
      // to be "out of" 100 is misleading.
      const totals = { [TOTAL_COURSE_GRADE_HEADING]: `${this.roundGrade(entry.percent * 100)}%` };
      return Object.assign(results, assignments, totals);
    }),
  };

  formatHeadings = () => {
    let headings = [...this.props.headings];

    if (headings.length > 0) {
      const headerLabelReplacements = {};
      headerLabelReplacements[USERNAME_HEADING] = (
        <div>
          <div>Username</div>
          <div className="font-weight-normal student-key">Student Key*</div>
        </div>
      );
      headerLabelReplacements[EMAIL_HEADING] = 'Email*';

      const totalGradePercentageMessage = 'Total Grade values are always displayed as a percentage.';
      headerLabelReplacements[TOTAL_COURSE_GRADE_HEADING] = (
        <div>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            key="left-basic"
            placement="left"
            overlay={(<Tooltip id="course-grade-tooltip">{totalGradePercentageMessage}</Tooltip>)}
          >
            <div>
              {TOTAL_COURSE_GRADE_HEADING}
              <div id="courseGradeTooltipIcon">
                <Icon className="fa fa-info-circle" screenReaderText={totalGradePercentageMessage} />
              </div>
            </div>
          </OverlayTrigger>
        </div>
      );

      headings = headings.map(heading => {
        const result = {
          label: heading,
          key: heading,
        };
        if (headerLabelReplacements[heading] !== undefined) {
          result.label = headerLabelReplacements[heading];
        }
        return result;
      });
    }

    return headings;
  }

  render() {
    return (
      <div className="gradebook-container">
        <div className="gbook">
          <Table
            columns={this.formatHeadings()}
            data={this.formatter[this.props.format](
              this.props.grades,
              this.props.areGradesFrozen,
            )}
            rowHeaderColumnKey="username"
            hasFixedColumnWidths
          />
        </div>
      </div>
    );
  }
}

GradebookTable.defaultProps = {
  areGradesFrozen: false,
  grades: [],
};

GradebookTable.propTypes = {
  setGradebookState: PropTypes.func.isRequired,
  // redux
  areGradesFrozen: PropTypes.bool,
  format: PropTypes.string.isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    percent: PropTypes.number,
    section_breakdown: PropTypes.arrayOf(PropTypes.shape({
      attempted: PropTypes.bool,
      category: PropTypes.string,
      label: PropTypes.string,
      module_id: PropTypes.string,
      percent: PropTypes.number,
      scoreEarned: PropTypes.number,
      scorePossible: PropTypes.number,
      subsection_name: PropTypes.string,
    })),
    user_id: PropTypes.number,
    user_name: PropTypes.string,
  })),
  headings: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchGradeOverrideHistory: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
  const { assignmentTypes, grades, root } = selectors;
  return {
    areGradesFrozen: assignmentTypes.areGradesFrozen(state),
    format: grades.gradeFormat(state),
    grades: grades.allGrades(state),
    headings: root.getHeadings(state),
  };
};

export const mapDispatchToProps = {
  fetchGradeOverrideHistory: thunkActions.grades.fetchGradeOverrideHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookTable);
