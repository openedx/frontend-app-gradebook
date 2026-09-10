import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import { useFilters } from '@src/data/filtersContext';
import { useAssignmentTypes, useCourseIdWithGate } from '@src/data/apiHook';
import { useSelectableAssignmentLabels } from '@src/components/GradesView/data/hooks';

import SelectGroup from '../SelectGroup';
import messages from '../messages';

export const AssignmentTypeFilter = ({ updateQueryParams }) => {
  const { courseId, enabled } = useCourseIdWithGate();
  const assignmentTypes = useAssignmentTypes(courseId, { enabled }).data?.assignmentTypes ?? [];
  const assignmentFilterOptions = useSelectableAssignmentLabels();
  const { assignmentType: selectedAssignmentType, setAssignmentType } = useFilters();
  const { formatMessage } = useIntl();

  const handleChange = (event) => {
    const assignmentType = event.target.value;
    setAssignmentType(assignmentType);
    updateQueryParams({ assignmentType });
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
