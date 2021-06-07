/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Table,
} from '@edx/paragon';

import { EMAIL_HEADING, TOTAL_COURSE_GRADE_HEADING, USERNAME_HEADING } from 'data/constants/grades';
import selectors from 'data/selectors';

import Fields from './Fields';
import LabelReplacements from './LabelReplacements';
import GradeButton from './GradeButton';

export const DECIMAL_PRECISION = 2;
export const headerLabelReplacements = {
  [TOTAL_COURSE_GRADE_HEADING]: <LabelReplacements.TotalGradeLabelReplacement />,
  [USERNAME_HEADING]: <LabelReplacements.UsernameLabelReplacement />,
};

export class GradebookTable extends React.Component {
  replaceHeader = (heading) => {
    const replacement = headerLabelReplacements[heading];
    return {
      label: replacement !== undefined ? replacement : heading,
      key: heading,
    };
  }

  formatHeadings = () => (
    this.props.headings.length
      ? this.props.headings.map(this.replaceHeader)
      : this.props.headings
  )

  roundGrade = percent => parseFloat((percent || 0).toFixed(DECIMAL_PRECISION));

  data = () => this.props.grades.map(entry => ({
    [USERNAME_HEADING]: (<Fields.Username entry={entry} />),
    [EMAIL_HEADING]: (<Fields.Email entry={entry} />),
    ...entry.section_breakdown.reduce(
      (obj, subsection) => ({
        ...obj,
        [subsection.label]: this.formatter[this.props.format](entry, subsection),
      }),
      {},
    ),
    [TOTAL_COURSE_GRADE_HEADING]: `${this.roundGrade(entry.percent * 100)}%`,
  }));

  formatter = {
    percent: (entry, subsection) => {
      const entryGrade = this.roundGrade(subsection.percent * 100);
      const label = `${entryGrade}`;
      return (this.props.areGradesFrozen
        ? label
        : (<GradeButton {...{ entry, subsection, label }} />)
      );
    },

    absolute: (entry, subsection) => {
      const earned = this.roundGrade(subsection.score_earned);
      const possible = this.roundGrade(subsection.score_possible);
      const label = subsection.attempted ? `${earned}/${possible}` : `${earned}`;
      return (this.props.areGradesFrozen
        ? label
        : (<GradeButton {...{ entry, subsection, label }} />)
      );
    },
  }

  render() {
    return (
      <div className="gradebook-container">
        <div className="gbook">
          <Table
            columns={this.formatHeadings()}
            data={this.data()}
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
};

export const mapStateToProps = (state) => ({
  areGradesFrozen: selectors.assignmentTypes.areGradesFrozen(state),
  format: selectors.grades.gradeFormat(state),
  grades: selectors.grades.allGrades(state),
  headings: selectors.root.getHeadings(state),
});

export default connect(mapStateToProps)(GradebookTable);
