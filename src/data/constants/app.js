import { StrictDict } from 'utils';
import { getConfig } from '@edx/frontend-platform';

export const routePath = `${getConfig().PUBLIC_PATH}:courseId`;

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
    key: 'filename',
    label: 'Gradebook',
    columnSortable: false,
    width: 'col-5',
  },
  {
    key: 'resultsSummary',
    label: 'Download Summary',
    columnSortable: false,
    width: 'col',
  },
  {
    key: 'user',
    label: 'Who',
    columnSortable: false,
    width: 'col-1',
  },
  {
    key: 'timeUploaded',
    label: 'When',
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

/**
 * Display strings for various app components.
 * Note: this is a temporary storage location for these strings, before we put them in
 * messages files for translation.
 */
export const messages = StrictDict({
  BulkManagementTab: StrictDict({
    csvUploadLabel: 'Upload Grade CSV',
    heading: 'Use this feature by downloading a CSV for bulk management, overriding grades locally, and coming back here to upload.',
    importBtnText: 'Import Grades',
    successDialog: 'CSV processing. File uploads may take several minutes to complete.',
    hints: [
      'Results appear in the table below.',
      'Grade processing may take a few seconds.',
    ],
  }),
});
