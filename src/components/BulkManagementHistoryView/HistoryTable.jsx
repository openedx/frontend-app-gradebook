/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from '@edx/paragon';

import { bulkManagementColumns } from 'data/constants/app';
import selectors from 'data/selectors';

import ResultsSummary from './ResultsSummary';

export const mapHistoryRows = ({
  resultsSummary,
  originalFilename,
  user,
  ...rest
}) => ({
  resultsSummary: (<ResultsSummary {...resultsSummary} />),
  filename: (<span className="wrap-text-in-cell">{originalFilename}</span>),
  user: (<span className="wrap-text-in-cell">{user}</span>),
  ...rest,
});

/**
 * <HistoryTable />
 * Table with history of bulk management uploads, including a results summary which
 * displays total, skipped, and failed uploads
 */
export const HistoryTable = ({
  bulkManagementHistory,
}) => (
  <>
    <Table
      data={bulkManagementHistory.map(mapHistoryRows)}
      hasFixedColumnWidths
      columns={bulkManagementColumns}
      className="table-striped"
    />
  </>
);
HistoryTable.defaultProps = {
  bulkManagementHistory: [],
};
HistoryTable.propTypes = {
  // redux
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    originalFilename: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    timeUploaded: PropTypes.string.isRequired,
    resultsSummary: PropTypes.shape({
      rowId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    }),
  })),
};

export const mapStateToProps = (state) => ({
  bulkManagementHistory: selectors.grades.bulkManagementHistoryEntries(state),
});

export default connect(mapStateToProps)(HistoryTable);
