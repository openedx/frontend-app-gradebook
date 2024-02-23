import PropTypes from 'prop-types';

import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import PercentGroup from '../PercentGroup';
import useCourseGradeFilterData from './hooks';

export const CourseGradeFilter = ({ updateQueryParams }) => {
  const {
    max,
    min,
    isDisabled,
    handleApplyClick,
  } = useCourseGradeFilterData({ updateQueryParams });
  const { formatMessage } = useIntl();

  return (
    <>
      <div className="grade-filter-inputs">
        <PercentGroup
          id="minimum-grade"
          label={formatMessage(messages.minGrade)}
          value={min.value}
          onChange={min.onChange}
        />
        <PercentGroup
          id="maximum-grade"
          label={formatMessage(messages.maxGrade)}
          value={max.value}
          onChange={max.onChange}
        />
      </div>
      <div className="grade-filter-action">
        <Button
          variant="outline-secondary"
          onClick={handleApplyClick}
          disabled={isDisabled}
        >
          {formatMessage(messages.apply)}
        </Button>
      </div>
    </>
  );
};

CourseGradeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default CourseGradeFilter;
