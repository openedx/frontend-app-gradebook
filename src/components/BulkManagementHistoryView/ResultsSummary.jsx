import PropTypes from 'prop-types';

import { Hyperlink, Icon } from '@openedx/paragon';
import { Download } from '@openedx/paragon/icons';

import lms from '@src/data/services/lms';
import { useCourseId } from '@src/data/courseIdContext';

/**
 * <ResultsSummary {...{ rowId, text }} />
 * displays a result summary cell for a single bulk management upgrade history entry.
 * @param {number} rowId - row/error identifier
 * @param {string} text - summary string
 */
const ResultsSummary = ({
  rowId,
  text,
}) => {
  const courseId = useCourseId();
  return (
    <Hyperlink
      destination={lms.urls.bulkGradesUrlByRow(courseId, rowId)}
      target="_blank"
      showLaunchIcon={false}
    >
      <Icon src={Download} className="d-inline-block" />
      {text}
    </Hyperlink>
  );
};

ResultsSummary.propTypes = {
  rowId: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ResultsSummary;
