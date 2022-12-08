/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DataTable } from '@edx/paragon';
import { FormattedMessage, getLocale, isRtl } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import { Headings } from 'data/constants/grades';

import messages from './messages';
import Fields from './Fields';
import LabelReplacements from './LabelReplacements';
import GradeButton from './GradeButton';

const { roundGrade } = selectors.grades;

/**
 * <GraebookTable />
 * This is the wrapper component for the Grades tab gradebook table, holding
 * a row for each user, with a column for their username, email, and total grade,
 * along with one for each subsection in their grade entry.
 */
export class GradebookTable extends React.Component {
  constructor(props) {
    super(props);
    this.mapHeaders = this.mapHeaders.bind(this);
    this.mapRows = this.mapRows.bind(this);
    this.nullMethod = this.nullMethod.bind(this);
  }

  mapHeaders(heading) {
    let label;
    if (heading === Headings.totalGrade) {
      label = <LabelReplacements.TotalGradeLabelReplacement />;
    } else if (heading === Headings.username) {
      label = <LabelReplacements.UsernameLabelReplacement />;
    } else if (heading === Headings.email) {
      label = <FormattedMessage {...messages.emailHeading} />;
    } else {
      label = heading;
    }
    return { Header: label, accessor: heading };
  }

  mapRows(entry) {
    const dataRow = {
      [Headings.username]: (
        <Fields.Username username={entry.username} userKey={entry.external_user_key} />
      ),
      [Headings.email]: (<Fields.Email email={entry.email} />),
      [Headings.totalGrade]: `${roundGrade(entry.percent * 100)}${isRtl(getLocale()) ? '\u200f' : ''}%`,
    };
    entry.section_breakdown.forEach(subsection => {
      dataRow[subsection.label] = (
        <GradeButton {...{ entry, subsection }} />
      );
    });
    return dataRow;
  }

  nullMethod() {
    return null;
  }

  render() {
    return (
      <div className="gradebook-container">
        <DataTable
          columns={this.props.headings.map(this.mapHeaders)}
          data={this.props.grades.map(this.mapRows)}
          rowHeaderColumnKey="username"
          hasFixedColumnWidths
          itemCount={this.props.grades.length}
          RowStatusComponent={this.nullMethod}
        >
          <DataTable.TableControlBar />
          <DataTable.Table />
          <DataTable.EmptyTable content={<FormattedMessage {...messages.noResultsFound} />} />
        </DataTable>
      </div>
    );
  }
}

GradebookTable.defaultProps = {
  grades: [],
};

GradebookTable.propTypes = {
  // redux
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
  grades: selectors.grades.allGrades(state),
  headings: selectors.root.getHeadings(state),
});

export default connect(mapStateToProps)(GradebookTable);
