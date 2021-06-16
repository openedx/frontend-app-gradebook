/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { Hyperlink, Icon } from '@edx/paragon';
import { Download } from '@edx/paragon/icons';

import { bulkGradesUrlByCourseAndRow } from 'data/constants/api';

/**
 * <ResultsSummary {...{ courseId, rowId, text }} />
 * displays a result summary cell for a single bulk management upgrade history entry.
 * @param {string} courseId - course identifier
 * @param {number} rowId - row/error identifier
 * @param {string} text - summary string
 */
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
