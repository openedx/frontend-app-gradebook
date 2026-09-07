/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';

import { useFilters } from 'data/filtersContext';
import {
  useFetchGradesIfAssignmentGradeFiltersSet,
  useSelectableAssignmentLabels,
  useSelectedAssignmentLabel,
} from 'components/GradesView/data/hooks';

import messages from '../messages';
import SelectGroup from '../SelectGroup';

const AssignmentFilter = ({ updateQueryParams }) => {
  const { formatMessage } = useIntl();
  const assignmentFilterOptions = useSelectableAssignmentLabels();
  const selectedAssignmentLabel = useSelectedAssignmentLabel() || '';
  const { setAssignment } = useFilters();
  const conditionalFetch = useFetchGradesIfAssignmentGradeFiltersSet();

  const handleChange = ({ target: { value: assignment } }) => {
    const selectedFilterOption = assignmentFilterOptions.find(
      ({ label }) => label === assignment,
    );
    const { id } = selectedFilterOption || {};
    setAssignment(id ?? '');
    updateQueryParams({ assignment: id });
    conditionalFetch();
  };

  const filterOptions = assignmentFilterOptions.map(({ label, subsectionLabel }) => (
    <option key={label} value={label}>
      {label}: {subsectionLabel}
    </option>
  ));
  return (
    <div className="student-filters">
      <SelectGroup
        id="assignment"
        label={formatMessage(messages.assignment)}
        value={selectedAssignmentLabel}
        onChange={handleChange}
        disabled={assignmentFilterOptions.length === 0}
        options={[
          <option key="0" value="">All</option>,
          ...filterOptions,
        ]}
      />
    </div>
  );
};

AssignmentFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
};

export default AssignmentFilter;
