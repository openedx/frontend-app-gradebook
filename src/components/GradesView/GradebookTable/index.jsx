import React from 'react';

import { DataTable } from '@edx/paragon';

import useGradebookTableData from './hooks';

/**
 * <GraebookTable />
 * This is the wrapper component for the Grades tab gradebook table, holding
 * a row for each user, with a column for their username, email, and total grade,
 * along with one for each subsection in their grade entry.
 */
export const GradebookTable = () => {
  const {
    columns,
    data,
    grades,
    nullMethod,
    emptyContent,
  } = useGradebookTableData();

  return (
    <div className="gradebook-container">
      <DataTable
        columns={columns}
        data={data}
        rowHeaderColumnKey="username"
        hasFixedColumnWidths
        itemCount={grades.length}
        RowStatusComponent={nullMethod}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content={emptyContent} />
      </DataTable>
    </div>
  );
};

GradebookTable.propTypes = {};

export default GradebookTable;
