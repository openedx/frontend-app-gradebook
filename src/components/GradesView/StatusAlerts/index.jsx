import React from 'react';

import { Alert } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useCourseGradeFilterValidity } from '@src/components/GradebookFilters/data/hooks';

import messages from './messages';

export const StatusAlerts = () => {
  const { formatMessage } = useIntl();
  const { isMinValid, isMaxValid } = useCourseGradeFilterValidity();
  const { showSuccess, setShowSuccess } = useGradebookUi();

  const gradeFilterText = `${isMinValid ? '' : formatMessage(messages.minGradeInvalid)}${isMaxValid ? '' : formatMessage(messages.maxGradeInvalid)}`;

  return (
    <>
      <Alert
        variant="success"
        onClose={() => setShowSuccess(false)}
        show={showSuccess}
      >
        {formatMessage(messages.editSuccessAlert)}
      </Alert>
      <Alert
        variant="danger"
        dismissible={false}
        show={!isMinValid || !isMaxValid}
      >
        {gradeFilterText}
      </Alert>
    </>
  );
};

StatusAlerts.propTypes = {};

export default StatusAlerts;
