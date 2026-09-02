import { useIntl } from '@edx/frontend-platform/i18n';

import { gradeOverrideHistoryColumns as columns } from 'data/constants/app';
import { useGradeOverrideData } from 'components/GradesView/data/hooks';

import messages from './messages';

const useOverrideTableData = () => {
  const { formatMessage } = useIntl();

  const { gradeOverrideHistoryResults, hasOverrideErrors: hide } = useGradeOverrideData();
  const gradeOverrides = gradeOverrideHistoryResults || [];
  const tableProps = {};
  if (!hide) {
    tableProps.columns = [
      { Header: formatMessage(messages.dateHeader), accessor: columns.date },
      { Header: formatMessage(messages.graderHeader), accessor: columns.grader },
      { Header: formatMessage(messages.reasonHeader), accessor: columns.reason },
      { Header: formatMessage(messages.adjustedGradeHeader), accessor: columns.adjustedGrade },
    ];
    tableProps.data = gradeOverrides;
  }
  return { hide, ...tableProps };
};

export default useOverrideTableData;
