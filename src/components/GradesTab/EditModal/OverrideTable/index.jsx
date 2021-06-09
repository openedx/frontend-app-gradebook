/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from '@edx/paragon';

import selectors from 'data/selectors';
import ReasonInput from './ReasonInput';
import AdjustedGradeInput from './AdjustedGradeInput';

const GRADE_OVERRIDE_HISTORY_COLUMNS = [
  { label: 'Date', key: 'date' },
  { label: 'Grader', key: 'grader' },
  { label: 'Reason', key: 'reason' },
  { label: 'Adjusted grade', key: 'adjustedGrade' },
];

/**
 * <OverrideTable />
 * Table containing previous grade override entries, and an "edit" row
 * with todays date, an AdjustedGradeInput and a ReasonInput
 */
export const OverrideTable = ({
  hide,
  gradeOverrides,
  todaysDate,
}) => {
  if (hide) {
    return null;
  }
  return (
    <Table
      columns={GRADE_OVERRIDE_HISTORY_COLUMNS}
      data={[
        ...gradeOverrides,
        {
          adjustedGrade: <AdjustedGradeInput />,
          date: todaysDate,
          reason: <ReasonInput />,
        },
      ]}
    />
  );
};
OverrideTable.defaultProps = {
  gradeOverrides: [],
};
OverrideTable.propTypes = {
  // redux
  gradeOverrides: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    grader: PropTypes.string,
    reason: PropTypes.string,
    adjustedGrade: PropTypes.number,
  })),
  hide: PropTypes.bool.isRequired,
  todaysDate: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  hide: selectors.grades.hasOverrideErrors(state),
  gradeOverrides: selectors.grades.gradeOverrides(state),
  todaysDate: selectors.app.modalState.todaysDate(state),
});

export default connect(mapStateToProps)(OverrideTable);
