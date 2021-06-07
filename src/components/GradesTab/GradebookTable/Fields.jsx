import React from 'react';
import PropTypes from 'prop-types';

import { StrictDict } from 'utils';

const Username = ({ entry }) => (
  <div>
    <span className="wrap-text-in-cell">
      <div>
        <div>{entry.username}</div>
        {entry.external_user_key && <div className="student-key">{entry.external_user_key}</div>}
      </div>
    </span>
  </div>
);
Username.propTypes = {
  entry: PropTypes.shape({
    username: PropTypes.string,
    external_user_key: PropTypes.string,
  }).isRequired,
};

const Email = ({ entry }) => (
  <span className="wrap-text-in-cell">{entry.email}</span>
);
Email.propTypes = {
  entry: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};

export default StrictDict({
  Email,
  Username,
});
