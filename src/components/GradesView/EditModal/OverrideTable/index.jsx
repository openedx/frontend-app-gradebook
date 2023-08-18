/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';

import { DataTable } from '@edx/paragon';

import { formatDateForDisplay } from 'utils';

import ReasonInput from './ReasonInput';
import AdjustedGradeInput from './AdjustedGradeInput';
import useOverrideTableData from './hooks';

/**
 * <OverrideTable />
 * Table containing previous grade override entries, and an "edit" row
 * with todays date, an AdjustedGradeInput and a ReasonInput
 */

export const OverrideTable = () => {
  const { hide, columns, data } = useOverrideTableData();

  if (hide) { return null; }

  return (
    <DataTable
      columns={columns}
      data={[
        ...data,
        {
          adjustedGrade: <AdjustedGradeInput />,
          date: formatDateForDisplay(new Date()),
          reason: <ReasonInput />,
        },
      ]}
      itemCount={data.length}
    />
  );
};
OverrideTable.propTypes = {};

export default OverrideTable;
