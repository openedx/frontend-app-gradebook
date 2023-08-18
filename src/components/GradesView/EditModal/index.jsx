import React from 'react';

import {
  Button,
  Alert,
  ModalDialog,
  ActionRow,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import OverrideTable from './OverrideTable';
import ModalHeaders from './ModalHeaders';
import useEditModalData from './hooks';
import messages from './messages';

/**
 * <EditModal />
 * Wrapper component for the modal that allows editing the grade for an individual
 * unit, for a given student.
 * Provides a StatusAlert with override fetch errors if any are found, an OverrideTable
 * (with appropriate headers) for managing the actual override, and a submit button for
 * adjusting the grade.
 * (also provides a close button that clears the modal state)
 */
export const EditModal = () => {
  const { formatMessage } = useIntl();
  const {
    onClose,
    error,
    handleAdjustedGradeClick,
    isOpen,
  } = useEditModalData();

  return (
    <ModalDialog
      title={formatMessage(messages.title)}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      hasCloseButton
      isFullscreenOnMobile
    >
      <ModalDialog.Body>
        <div>
          <ModalHeaders />
          <Alert variant="danger" show={!!error} dismissible={false}>
            {error}
          </Alert>
          <OverrideTable />
          <div>{formatMessage(messages.visibility)}</div>
          <div>{formatMessage(messages.saveVisibility)}</div>
        </div>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            {formatMessage(messages.closeText)}
          </ModalDialog.CloseButton>
          <Button variant="primary" onClick={handleAdjustedGradeClick}>
            {formatMessage(messages.saveGrade)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EditModal;
