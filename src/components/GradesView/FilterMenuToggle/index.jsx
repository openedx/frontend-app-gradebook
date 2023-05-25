import React from 'react';

import { Button, Icon } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { FilterAlt } from '@edx/paragon/icons';

import { thunkActions } from 'data/redux/hooks';

import messages from './messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const FilterMenuToggle = () => {
  const toggleFilterMenu = thunkActions.app.filterMenu.useToggleMenu();
  const { formatMessage } = useIntl();
  return (
    <Button
      id="edit-filters-btn"
      className="btn-primary align-self-start"
      onClick={toggleFilterMenu}
    >
      <Icon src={FilterAlt} /> {formatMessage(messages.editFilters)}
    </Button>
  );
};

FilterMenuToggle.propTypes = {};

export default FilterMenuToggle;
