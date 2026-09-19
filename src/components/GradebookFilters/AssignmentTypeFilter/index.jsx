import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import { useFilters } from '@src/data/filtersContext';
import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';
import {
  useSelectableAssignmentLabels,
  useSelectedAssignmentData,
} from '@src/components/GradesView/data/hooks';

import SelectGroup from '../SelectGroup';
import messages from '../messages';

export const AssignmentTypeFilter = ({ updateQueryParams }) => {
  const { courseId, enabled } = useCourseIdWithGate();
  const assignmentTypes = useAssignmentTypes(courseId, { enabled }).data?.assignmentTypes ?? [];
  const assignmentFilterOptions = useSelectableAssignmentLabels();
  const selectedAssignment = useSelectedAssignmentData();
  const {
    assignmentType: selectedAssignmentType, setAssignmentType, setAssignment,
  } = useFilters();
  const { formatMessage } = useIntl();

  const handleChange = (event) => {
    const assignmentType = event.target.value;
    setAssignmentType(assignmentType);
    const queryParams = { assignmentType };
    // A selected assignment of a different type no longer matches the filter:
    // clear it (and its query param), as the legacy filters reducer did.
    if (assignmentType !== '' && selectedAssignment && selectedAssignment.type !== assignmentType) {
      setAssignment('');
      queryParams.assignment = false;
    }
    updateQueryParams(queryParams);
  };

  return (
    <div className="student-filters">
      <SelectGroup
        id="assignment-types"
        label={formatMessage(messages.assignmentTypes)}
        value={selectedAssignmentType}
        onChange={handleChange}
        disabled={assignmentFilterOptions.length === 0}
        options={[
          <option key="0" value="">All</option>,
          ...assignmentTypes.map(entry => (
            <option key={entry} value={entry}>{entry}</option>
          )),
        ]}
      />
    </div>
  );
};

AssignmentTypeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentTypeFilter;
