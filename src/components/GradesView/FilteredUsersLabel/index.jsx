import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux/hooks';
import messages from './messages';

export const BoldText = ({ text }) => (
  <span className="font-weight-bold">{text}</span>
);
BoldText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

/**
 * <FilteredUsersLabel />
 * Simple label component displaying the filtered and total users shown
 */
export const FilteredUsersLabel = () => {
  const { filteredUsersCount, totalUsersCount } = selectors.grades.useUserCounts();
  const { formatMessage } = useIntl();

  if (!totalUsersCount) {
    return null;
  }
  return formatMessage(
    messages.visibilityLabel,
    {
      filteredUsers: <BoldText text={filteredUsersCount} />,
      totalUsers: <BoldText text={totalUsersCount} />,
    },
  );
};
FilteredUsersLabel.propTypes = {};

export default FilteredUsersLabel;
