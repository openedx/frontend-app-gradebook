import React from 'react';

import { Alert } from '@edx/paragon';

import useStatusAlertsData from './hooks';

export const StatusAlerts = () => {
  const {
    successBanner,
    gradeFilter,
  } = useStatusAlertsData();

  return (
    <>
      <Alert
        variant="success"
        onClose={successBanner.onClose}
        show={successBanner.show}
      >
        {successBanner.text}
      </Alert>
      <Alert
        variant="danger"
        dismissible={false}
        show={gradeFilter.show}
      >
        {gradeFilter.text}
      </Alert>
    </>
  );
};

StatusAlerts.propTypes = {};

export default StatusAlerts;
