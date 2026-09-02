import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { roundGrade } from 'data/selectors/grades';
import { Headings } from 'data/constants/grades';
import { getLocalizedPercentSign } from 'i18n/utils';

import { useAllGrades, useGradesHeadings } from '../data/hooks';
import messages from './messages';
import Fields from './Fields';
import LabelReplacements from './LabelReplacements';
import GradeButton from './GradeButton';

export const useGradebookTableData = () => {
  const { formatMessage } = useIntl();
  const grades = useAllGrades();
  const headings = useGradesHeadings();

  const mapHeaders = (heading) => {
    let label;
    if (heading === Headings.totalGrade) {
      label = <LabelReplacements.TotalGradeLabelReplacement />;
    } else if (heading === Headings.username) {
      label = <LabelReplacements.UsernameLabelReplacement />;
    } else if (heading === Headings.email) {
      label = <LabelReplacements.MastersOnlyLabelReplacement {...messages.emailHeading} />;
    } else if (heading === Headings.fullName) {
      label = <LabelReplacements.MastersOnlyLabelReplacement {...messages.fullNameHeading} />;
    } else {
      label = heading;
    }
    return { Header: label, accessor: heading };
  };

  const mapRows = entry => ({
    [Headings.username]: (
      <Fields.Username username={entry.username} userKey={entry.external_user_key} />
    ),
    [Headings.email]: (<Fields.Text value={entry.email} />),
    [Headings.totalGrade]: `${roundGrade(entry.percent * 100)}${getLocalizedPercentSign()}`,
    ...entry.section_breakdown.reduce((acc, subsection) => ({
      ...acc,
      [subsection.label]: <GradeButton {...{ entry, subsection }} />,
    }), {}),
  });

  const nullMethod = () => null;

  return {
    columns: headings.map(mapHeaders),
    data: grades.map(mapRows),
    grades,
    nullMethod,
    emptyContent: formatMessage(messages.noResultsFound),
  };
};

export default useGradebookTableData;
