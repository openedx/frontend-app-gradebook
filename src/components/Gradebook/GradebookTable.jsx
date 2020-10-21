/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from '@edx/paragon';

import { formatDateForDisplay } from '../../data/actions/utils';
import { getHeadings } from '../../data/selectors/grades';
import { fetchGradeOverrideHistory } from '../../data/actions/grades';

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
        Username: (
          <div><span className="wrap-text-in-cell">{learnerInformation}</span></div>
        ),
        Email: (
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
      const totals = { Total: `${this.roundGrade(entry.percent * 100)}%` };
      return Object.assign(results, assignments, totals);
    }),

    absolute: (entries, areGradesFrozen) => entries.map((entry) => {
      const learnerInformation = this.getLearnerInformation(entry);
      const results = {
        Username: (
          <div><span className="wrap-text-in-cell">{learnerInformation}</span></div>
        ),
        Email: (
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

      const totals = { Total: `${this.roundGrade(entry.percent * 100)}/100` };
      return Object.assign(results, assignments, totals);
    }),
  };

  formatHeadings = () => {
    let headings = [...this.props.headings];

    if (headings.length > 0) {
      const userInformationHeadingLabel = (
        <div>
          <div>Username</div>
          <div className="font-weight-normal student-key">Student Key*</div>
        </div>
      );
      const emailHeadingLabel = 'Email*';

      headings = headings.map(heading => ({
        label: heading,
        key: heading,
      }));

      // replace username heading label to include additional user data
      headings[0].label = userInformationHeadingLabel;
      headings[1].label = emailHeadingLabel;
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

export const mapStateToProps = (state) => ({
  areGradesFrozen: state.assignmentTypes.areGradesFrozen,
  format: state.grades.gradeFormat,
  grades: state.grades.results,
  headings: getHeadings(state),
});

export const mapDispatchToProps = {
  fetchGradeOverrideHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradebookTable);
