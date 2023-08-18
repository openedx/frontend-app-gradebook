import React from 'react';

import { useIntl, getLocale, isRtl } from '@edx/frontend-platform/i18n';
import {
  Icon,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';

import { StrictDict } from 'utils';

import messages from './messages';

export const totalGradePercentageMessage = 'Total Grade values are always displayed as a percentage.';

/**
 * <TotalGradeLabelReplacement />
 * Total Grade column header.
 * displays an overlay tooltip with screen-reader text to indicate total grade percentage
 */
const TotalGradeLabelReplacement = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        key="left-basic"
        placement={isRtl(getLocale()) ? 'right' : 'left'}
        overlay={(
          <Tooltip id="course-grade-tooltip">
            {formatMessage(messages.totalGradePercentage)}
          </Tooltip>
        )}
      >
        <div>
          {formatMessage(messages.totalGradeHeading)}
          <div id="courseGradeTooltipIcon">
            <Icon
              className="fa fa-info-circle"
              screenReaderText={formatMessage(messages.totalGradePercentage)}
            />
          </div>
        </div>
      </OverlayTrigger>
    </div>
  );
};

/**
 * Asterisk to display next to heading labels that are only used for masters students
 */
const mastersOnlyFieldAsterisk = (
  <span className="font-weight-normal">*</span>
);

/**
 * <UsernameLabelReplacement />
 * Username column header.  Lists that Student Key is possibly available
 */
const UsernameLabelReplacement = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <div>
        {formatMessage(messages.usernameHeading)}
      </div>
      <div className="font-weight-normal student-key">
        {formatMessage(messages.studentKeyLabel)}
        { mastersOnlyFieldAsterisk }
      </div>
    </div>
  );
};

/**
 * <MastersOnlyLabelReplacement {message}>
 * Column header for fields that are only available for masters students
 */
const MastersOnlyLabelReplacement = (message) => {
  const { formatMessage } = useIntl();
  return (
    <div>
      {formatMessage(message)}
      { mastersOnlyFieldAsterisk }
    </div>
  );
};

export default StrictDict({
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
  MastersOnlyLabelReplacement,
});
