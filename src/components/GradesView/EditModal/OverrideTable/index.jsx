/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { gradeOverrideHistoryColumns as columns } from 'data/constants/app';
import selectors from 'data/selectors';

import messages from './messages';
import ReasonInput from './ReasonInput';
import AdjustedGradeInput from './AdjustedGradeInput';

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
      columns={[
        { label: <FormattedMessage {...messages.dateHeader} />, key: columns.date },
        { label: <FormattedMessage {...messages.graderHeader} />, key: columns.grader },
        { label: <FormattedMessage {...messages.reasonHeader} />, key: columns.reason },
        {
          label: <FormattedMessage {...messages.adjustedGradeHeader} />,
          key: columns.adjustedGrade,
        },
      ]}
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
