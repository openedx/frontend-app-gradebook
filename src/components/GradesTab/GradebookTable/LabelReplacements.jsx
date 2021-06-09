import React from 'react';

import { StrictDict } from 'utils';

import {
  Icon,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';

import { Headings } from 'data/constants/grades';

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
      placement="left"
      overlay={(<Tooltip id="course-grade-tooltip">{totalGradePercentageMessage}</Tooltip>)}
    >
      <div>
        {Headings.totalGrade}
        <div id="courseGradeTooltipIcon">
          <Icon className="fa fa-info-circle" screenReaderText={totalGradePercentageMessage} />
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
    <div>Username</div>
    <div className="font-weight-normal student-key">Student Key*</div>
  </div>
);

export default StrictDict({
  TotalGradeLabelReplacement,
  UsernameLabelReplacement,
});
