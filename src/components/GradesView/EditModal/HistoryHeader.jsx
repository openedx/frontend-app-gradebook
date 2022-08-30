import React from 'react';
import PropTypes from 'prop-types';

/**
 * HistoryHeader
 * simple display container for an individual history table header
 * @param {string} id - header id
 * @param {string} label - header label
 * @param {string} value - header value
 */
const HistoryHeader = ({ label, value }) => (
  <div className="row">
    <div className="col-2">{label}: </div>
    <div>{value}</div>
  </div>
);
HistoryHeader.defaultProps = {
  value: null,
};
HistoryHeader.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default HistoryHeader;
