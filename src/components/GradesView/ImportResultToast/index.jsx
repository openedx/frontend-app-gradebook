import React from 'react';

import { Toast } from '@openedx/paragon';

import useImportResultToastData from './hooks';

/**
 * <ImportResultToast />
 * Toast component triggered by a grade upload, reporting either that it succeeded or that
 * it failed -- rejected by the server, or applied no grades at all.
 * Provides a link to view the Bulk Management History tab.
 */
export const ImportResultToast = () => {
  const {
    action,
    onClose,
    show,
    autohide,
    description,
  } = useImportResultToastData();
  return (
    <Toast
      action={action}
      onClose={onClose}
      show={show}
      autohide={autohide}
    >
      {description}
    </Toast>
  );
};

ImportResultToast.propTypes = {};

export default ImportResultToast;
