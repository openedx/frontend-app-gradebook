import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

/**
 * <EdxHeader />
 * Gradebook MFE app header.
 * Displays edx logo, linked to lms dashboard
 */
const EdxHeader = () => (
  <div className="mb-3">
    <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
      <Hyperlink destination={`${getConfig().LMS_BASE_URL}/dashboard`}>
        <img src={getConfig().LOGO_URL} alt="edX logo" height="30" width="60" />
      </Hyperlink>
      <div />
    </header>
  </div>
);

export default EdxHeader;
