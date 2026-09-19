import { DataTable } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { formatDateForDisplay } from '@src/utils';
import { gradeOverrideHistoryColumns as columns } from '@src/data/constants/app';
import { useGradeOverrideData } from '@src/components/GradesView/data/hooks';

import ReasonInput from './ReasonInput';
import AdjustedGradeInput from './AdjustedGradeInput';
import messages from './messages';

/**
 * <OverrideTable />
 * Table containing previous grade override entries, and an "edit" row
 * with todays date, an AdjustedGradeInput and a ReasonInput
 */

export const OverrideTable = () => {
  const { formatMessage } = useIntl();
  const { gradeOverrideHistoryResults, hasOverrideErrors: hide } = useGradeOverrideData();

  if (hide) { return null; }

  const tableColumns = [
    { Header: formatMessage(messages.dateHeader), accessor: columns.date },
    { Header: formatMessage(messages.graderHeader), accessor: columns.grader },
    { Header: formatMessage(messages.reasonHeader), accessor: columns.reason },
    { Header: formatMessage(messages.adjustedGradeHeader), accessor: columns.adjustedGrade },
  ];
  const tableData = [
    ...(gradeOverrideHistoryResults || []),
    {
      adjustedGrade: <AdjustedGradeInput />,
      date: formatDateForDisplay(new Date()),
      reason: <ReasonInput />,
    },
  ];

  return (
    <DataTable
      columns={tableColumns}
      data={tableData}
      itemCount={tableData.length}
    />
  );
};
OverrideTable.propTypes = {};

export default OverrideTable;
