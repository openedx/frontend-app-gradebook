import PropTypes from 'prop-types';

import { DataTable } from '@openedx/paragon';

import { bulkManagementColumns } from '@src/data/constants/app';
import { useBulkManagementHistoryEntries } from './data/apiHook';

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
  <DataTable
    data={bulkManagementHistory.map(mapHistoryRows)}
    hasFixedColumnWidths
    columns={bulkManagementColumns}
    className="table-striped"
    itemCount={bulkManagementHistory.length}
  />
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

/**
 * <HistoryTableContainer />
 * Supplies the bulk-management history (now from React Query) to the
 * presentational <HistoryTable />.
 */
export const HistoryTableContainer = () => {
  const bulkManagementHistory = useBulkManagementHistoryEntries();
  return <HistoryTable bulkManagementHistory={bulkManagementHistory} />;
};

export default HistoryTableContainer;
