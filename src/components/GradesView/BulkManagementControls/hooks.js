import { actions, selectors } from 'data/redux/hooks';

export const useBulkManagementControlsData = () => {
  const gradeExportUrl = selectors.root.useGradeExportUrl();
  const showBulkManagement = selectors.root.useShowBulkManagement();
  const downloadBulkGradesReport = actions.grades.useDownloadBulkGradesReport();

  const handleClickExportGrades = () => {
    downloadBulkGradesReport();
    window.location.assign(gradeExportUrl);
  };

  return {
    show: showBulkManagement,
    handleClickExportGrades,
  };
};
export default useBulkManagementControlsData;
