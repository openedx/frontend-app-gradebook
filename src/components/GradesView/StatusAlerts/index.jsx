import React from 'react';

import { Alert } from '@openedx/paragon';

import useStatusAlertsData from './hooks';

export const StatusAlerts = () => {
  const {
    successBanner,
    courseGradeFilter,
    assignmentGradeFilter,
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
        show={assignmentGradeFilter.show}
      >
        {assignmentGradeFilter.text}
      </Alert>
      <Alert
        variant="danger"
        dismissible={false}
        show={courseGradeFilter.show}
      >
        {courseGradeFilter.text}
      </Alert>
    </>
  );
};

StatusAlerts.propTypes = {};

export default StatusAlerts;
