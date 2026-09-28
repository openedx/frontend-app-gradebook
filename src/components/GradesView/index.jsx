import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import { useFilters } from '@src/data/filtersContext';

import BulkManagementControls from './BulkManagementControls';
import EditModal from './EditModal';
import FilterBadges from './FilterBadges';
import FilteredUsersLabel from './FilteredUsersLabel';
import FilterMenuToggle from './FilterMenuToggle';
import GradebookTable from './GradebookTable';
import ImportSuccessToast from './ImportSuccessToast';
import InterventionsReport from './InterventionsReport';
import PageButtons from './PageButtons';
import ScoreViewInput from './ScoreViewInput';
import SearchControls from './SearchControls';
import SpinnerIcon from './SpinnerIcon';
import StatusAlerts from './StatusAlerts';
import { Bubble, Container } from '@openedx/paragon';

import { useRefetchGrades } from './data/hooks';
import messages from './messages';

export const GradesView = ({ updateQueryParams }) => {
  const { formatMessage } = useIntl();
  const { resetFilters: resetContextFilters } = useFilters();
  const fetchGrades = useRefetchGrades();

  const handleFilterBadgeClose = (filterNames) => () => {
    resetContextFilters(filterNames);
    updateQueryParams(filterNames.reduce(
      (obj, filterName) => ({ ...obj, [filterName]: false }),
      {},
    ));
    fetchGrades();
  };

  return (
    <>
      <SpinnerIcon />

      <InterventionsReport />

      <Container className="mb-3">
        <h4 className="d-flex align-items-center text-primary-700">
          <Bubble className="mr-2">
          1
          </Bubble>
          {formatMessage(messages.filterStepHeading)}
        </h4>
        <div className="d-flex justify-content-between flex-wrap ml-3">
          <FilterMenuToggle />
          <SearchControls />
        </div>

        <FilterBadges handleClose={handleFilterBadgeClose} />
        <StatusAlerts />

        <h4 className="d-flex align-items-center text-primary-700">
          <Bubble className="mr-2">
          2
          </Bubble>
          {formatMessage(messages.gradebookStepHeading)}
        </h4>

        <div className="d-flex justify-content-between align-items-center mb-2 ml-3">
          <ScoreViewInput />
          <BulkManagementControls />
        </div>
      </Container>
      

      <GradebookTable />

      <FilteredUsersLabel />

      <PageButtons />
      <p>* {formatMessage(messages.mastersHint)}</p>
      <EditModal />

      <ImportSuccessToast />
    </>
  );
};

GradesView.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default GradesView;
