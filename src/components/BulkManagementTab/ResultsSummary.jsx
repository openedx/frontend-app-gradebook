/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { Hyperlink, Icon } from '@edx/paragon';
import { Download } from '@edx/paragon/icons';

import lms from 'data/services/lms';

/**
 * <ResultsSummary {...{ courseId, rowId, text }} />
 * displays a result summary cell for a single bulk management upgrade history entry.
 * @param {string} courseId - course identifier
 * @param {number} rowId - row/error identifier
 * @param {string} text - summary string
 */
const ResultsSummary = ({
  rowId,
  text,
}) => (
  <Hyperlink
    href={lms.urls.bulkGradesUrlByRow(rowId)}
    destination="www.edx.org"
    target="_blank"
    rel="noopener noreferrer"
    showLaunchIcon={false}
  >
    <Icon src={Download} className="d-inline-block" />
    {text}
  </Hyperlink>
);

ResultsSummary.propTypes = {
  rowId: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ResultsSummary;
