/* eslint-disable react/sort-comp, react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';

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

import useGradesViewData from './hooks';

export const GradesView = ({ updateQueryParams }) => {
  const {
    stepHeadings,
    handleFilterBadgeClose,
    mastersHint,
  } = useGradesViewData({ updateQueryParams });

  return (
    <>
      <SpinnerIcon />

      <InterventionsReport />
      <h3 className="step-message-1">
        {stepHeadings.filter}
      </h3>

      <div className="d-flex justify-content-between">
        <FilterMenuToggle />
        <SearchControls />
      </div>

      <FilterBadges handleClose={handleFilterBadgeClose} />
      <StatusAlerts />

      <h3>{stepHeadings.gradebook}</h3>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <ScoreViewInput />
        <BulkManagementControls />
      </div>

      <FilteredUsersLabel />

      <GradebookTable />

      <PageButtons />
      <p>* {mastersHint}</p>
      <EditModal />

      <ImportSuccessToast />
    </>
  );
};

GradesView.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default GradesView;
