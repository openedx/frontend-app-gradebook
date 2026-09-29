import PropTypes from 'prop-types';
import { useIntl } from '@openedx/frontend-base';
import { Bubble } from '@openedx/paragon';
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

      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <Bubble className="mr-2">1</Bubble>
          <h3 className="h4 text-primary-700 my-0">
            <span>{formatMessage(messages.filterStepHeading)}</span>
          </h3>
        </div>
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <FilterMenuToggle />
            <SearchControls />
          </div>

          <FilterBadges handleClose={handleFilterBadgeClose} />
          <StatusAlerts />
        </div>

        <div className="d-flex align-items-center mb-2">
          <Bubble className="mr-2">2</Bubble>
          <h3 className="h4 text-primary-700 my-0">
            <span>{formatMessage(messages.gradebookStepHeading)}</span>
          </h3>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <ScoreViewInput />
          <BulkManagementControls />
        </div>
      </div>

      <FilteredUsersLabel />

      <GradebookTable />

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
