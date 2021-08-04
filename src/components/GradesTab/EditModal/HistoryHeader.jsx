import React from 'react';
import PropTypes from 'prop-types';

/**
 * HistoryHeader
 * simple display container for an individual history table header
 * @param {string} id - header id
 * @param {string} label - header label
 * @param {string} value - header value
 */
const HistoryHeader = ({ id, label, value }) => (
  <div>
    <div className={`grade-history-header grade-history-${id}`}>{label}: </div>
    <div>{value}</div>
  </div>
);
HistoryHeader.defaultProps = {
  value: null,
};
HistoryHeader.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default HistoryHeader;
