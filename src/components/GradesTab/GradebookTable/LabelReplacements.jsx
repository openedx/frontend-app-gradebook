import React from 'react';

import { StrictDict } from 'utils';

import {
  Icon,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';

import { TOTAL_COURSE_GRADE_HEADING } from 'data/constants/grades';

const TotalGradeLabelReplacement = () => {
  const totalGradePercentageMessage = 'Total Grade values are always displayed as a percentage.';
  return (
    <div>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        key="left-basic"
        placement="left"
        overlay={(<Tooltip id="course-grade-tooltip">{totalGradePercentageMessage}</Tooltip>)}
      >
        <div>
          {TOTAL_COURSE_GRADE_HEADING}
          <div id="courseGradeTooltipIcon">
            <Icon className="fa fa-info-circle" screenReaderText={totalGradePercentageMessage} />
          </div>
        </div>
      </OverlayTrigger>
    </div>
  );
};

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
