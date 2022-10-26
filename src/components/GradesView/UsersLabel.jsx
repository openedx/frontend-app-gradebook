/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';

/**
 * <UsersLabel />
 * Simple label component displaying the filtered and total users shown
 */
export const UsersLabel = ({
  filteredUsersCount,
  totalUsersCount,
}) => {
  if (!totalUsersCount) {
    return null;
  }
  const bold = (val) => (<span className="font-weight-bold">{val}</span>);
  return (
    <FormattedMessage
      id="gradebook.GradesTab.usersVisibilityLabel'"
      defaultMessage="Showing {filteredUsers} of {totalUsers} total learners"
      description="Users visibility label"
      values={{
        filteredUsers: bold(filteredUsersCount),
        totalUsers: bold(totalUsersCount),
      }}
    />
  );
};
UsersLabel.propTypes = {
  filteredUsersCount: PropTypes.number.isRequired,
  totalUsersCount: PropTypes.number.isRequired,
};

export const mapStateToProps = (state) => ({
  totalUsersCount: selectors.grades.totalUsersCount(state),
  filteredUsersCount: selectors.grades.filteredUsersCount(state),
});

export default connect(mapStateToProps)(UsersLabel);
