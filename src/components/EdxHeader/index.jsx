import React from 'react';
import { Hyperlink } from '@openedx/paragon';
import { getSiteConfig } from '@openedx/frontend-base';

/**
 * <EdxHeader />
 * Gradebook MFE app header.
 * Displays edx logo, linked to lms dashboard
 */
const EdxHeader = () => (
  <div className="mb-3">
    <header className="d-flex justify-content-center align-items-center p-3 border-bottom-blue">
      <Hyperlink destination={`${getSiteConfig().lmsBaseUrl}/dashboard`}>
        <img src={getSiteConfig().headerLogoImageUrl} alt="edX logo" height="30" width="60" />
      </Hyperlink>
      <div />
    </header>
  </div>
);

export default EdxHeader;
