/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { Hyperlink, Icon } from '@edx/paragon';
import { Download } from '@edx/paragon/icons';

import { bulkGradesUrlByCourseAndRow } from 'data/constants/api';

const ResultsSummary = ({
  courseId,
  rowId,
  text,
}) => (
  <Hyperlink
    href={bulkGradesUrlByCourseAndRow(courseId, rowId)}
    destination="www.edx.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon icon={Download} />
    {text}
  </Hyperlink>
);

ResultsSummary.propTypes = {
  courseId: PropTypes.string.isRequired,
  rowId: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ResultsSummary;
