import { Button, Icon } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { FilterAlt } from '@openedx/paragon/icons';

import { useGradebookUi } from '@src/data/gradebookUiContext';

import messages from './messages';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const FilterMenuToggle = () => {
  const { toggleFilterMenu } = useGradebookUi();
  const { formatMessage } = useIntl();
  return (
    <Button
      id="edit-filters-btn"
      className="btn-primary align-self-start"
      onClick={toggleFilterMenu}
      size="sm"
    >
      <Icon src={FilterAlt} className="mr-1" size="sm" /> {formatMessage(messages.editFilters)}
    </Button>
  );
};

FilterMenuToggle.propTypes = {};

export default FilterMenuToggle;
