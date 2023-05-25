import React from 'react';

import { Toast } from '@edx/paragon';

import useImportSuccessToastData from './hooks';

/**
 * <ImportSuccessToast />
 * Toast component triggered by successful grade upload.
 * Provides a link to view the Bulk Management History tab.
 */
export const ImportSuccessToast = () => {
  const {
    action,
    onClose,
    show,
    description,
  } = useImportSuccessToastData();
  return (
    <Toast {...{ action, onClose, show }}>
      {description}
    </Toast>
  );
};

ImportSuccessToast.propTypes = {};

export default ImportSuccessToast;
