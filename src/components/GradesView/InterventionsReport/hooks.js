import { actions, selectors } from 'data/redux/hooks';

const useInterventionsReportData = () => {
  const interventionExportUrl = selectors.root.useInterventionExportUrl();
  const showBulkManagement = selectors.root.useShowBulkManagement();
  const downloadInterventionReport = actions.grades.useDownloadInterventionReport();

  const handleClick = () => {
    downloadInterventionReport();
    window.location.assign(interventionExportUrl);
  };

  return {
    show: showBulkManagement,
    handleClick,
  };
};

export default useInterventionsReportData;
