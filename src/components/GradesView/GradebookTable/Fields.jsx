import React from 'react';
import PropTypes from 'prop-types';

import { StrictDict } from 'utils';

/**
 * Fields.Username
 * simple label field for username, that optionally also displays external_user_key (userKey)
 * if it is provided.
 * @param {string} username - username for display
 * @param {userKey} userKey - external_user_key for display
 */
const Username = ({ username, userKey }) => (
  <div>
    <span className="text-wrap">
      <div>
        <div>{username}</div>
        {userKey && <div className="student-key">{userKey}</div>}
      </div>
    </span>
  </div>
);
Username.defaultProps = {
  userKey: null,
};
Username.propTypes = {
  username: PropTypes.string.isRequired,
  userKey: PropTypes.string,
};

/**
 * Fields.Email
 * Simple label field for email value.
 * @param {string} email - email for display
 */
const Email = ({ email }) => (
  <span className="text-wrap">{email}</span>
);
Email.propTypes = {
  email: PropTypes.string.isRequired,
};

export default StrictDict({
  Email,
  Username,
});
