import { useEffect, useRef } from 'react';

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
    toastProps,
    description,
  } = useImportResultToastData();

  // A failure waits to be dismissed, so switching tabs -- which unmounts this view -- has
  // to retire it. Otherwise it re-announces itself on every return to the Grades tab.
  // The ref keeps the cleanup on unmount only, rather than on every re-render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => () => onCloseRef.current(), []);

  return (
    <Toast
      action={action}
      onClose={onClose}
      show={show}
      {...toastProps}
    >
      {description}
    </Toast>
  );
};

ImportResultToast.propTypes = {};

export default ImportResultToast;
