import React from 'react';

import { StrictDict } from 'utils';

import {
  Icon,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { FormattedMessage, getLocale, isRtl } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const totalGradePercentageMessage = 'Total Grade values are always displayed as a percentage.';

/**
 * <TotalGradeLabelReplacement />
 * Total Grade column header.
 * displays an overlay tooltip with screen-reader text to indicate total grade percentage
 */
const TotalGradeLabelReplacement = () => (
  <div>
    <OverlayTrigger
      trigger={['hover', 'focus']}
      key="left-basic"
      placement={isRtl(getLocale()) ? 'right' : 'left'}
      overlay={(
        <Tooltip id="course-grade-tooltip">
          <FormattedMessage {...messages.totalGradePercentage} />
        </Tooltip>
      )}
    >
      <div>
        <FormattedMessage {...messages.totalGradeHeading} />
        <div id="courseGradeTooltipIcon">
          <Icon
            className="fa fa-info-circle"
            screenReaderText={(
              <FormattedMessage {...messages.totalGradePercentage} />
            )}
          />
        </div>
      </div>
    </OverlayTrigger>
  </div>
);

/**
 * <UsernameLabelReplacement />
 * Username column header.  Lists that Student Key is possibly available
 */
const UsernameLabelReplacement = () => (
  <div>
    <div>
      <FormattedMessage {...messages.usernameHeading} />
    </div>
    <div className="font-weight-normal student-key">
      <FormattedMessage {...messages.studentKeyLabel} />
    </div>
  </div>
);

export default StrictDict({
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
});
