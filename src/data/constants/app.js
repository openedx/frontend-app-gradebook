import { StrictDict } from 'utils';

export const views = StrictDict({
  grades: 'grades',
  bulkManagementHistory: 'bulkManagementHistory',
});

export const modalFieldKeys = StrictDict({
  adjustedGradePossible: 'adjustedGradePossible',
  adjustedGradeValue: 'adjustedGradeValue',
  assignmentName: 'assignmentName',
  reasonForChange: 'reasonForChange',
  todaysDate: 'todaysDate',
  updateModuleId: 'updateModuleId',
  updateUserId: 'updateUserId',
  updateUserName: 'updateUserName',
  open: 'open',
});

export const localFilterKeys = StrictDict({
  assignmentGradeMax: 'assignmentGradeMax',
  assignmentGradeMin: 'assignmentGradeMin',
  courseGradeMax: 'courseGradeMax',
  courseGradeMin: 'courseGradeMin',
});

/**
 * column configuration for bulk management tab's data table
 */
export const bulkManagementColumns = [
  {
    accessor: 'filename',
    Header: 'Gradebook',
    columnSortable: false,
    width: 'col-5',
  },
  {
    accessor: 'resultsSummary',
    Header: 'Download Summary',
    columnSortable: false,
    width: 'col',
  },
  {
    accessor: 'user',
    Header: 'Who',
    columnSortable: false,
    width: 'col-1',
  },
  {
    accessor: 'timeUploaded',
    Header: 'When',
    columnSortable: false,
    width: 'col',
  },
];

export const gradeOverrideHistoryColumns = StrictDict({
  adjustedGrade: 'adjustedGrade',
  date: 'date',
  grader: 'grader',
  reason: 'reason',
});
