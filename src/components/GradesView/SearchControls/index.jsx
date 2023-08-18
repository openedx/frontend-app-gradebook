import React from 'react';

import { SearchField } from '@edx/paragon';
import useSearchControlsData from './hooks';

/**
 * Controls for filtering the GradebookTable. Contains the "Edit Filters" button for opening the filter drawer
 * as well as the search box for searching by username/email.
 */
export const SearchControls = () => {
  const {
    onSubmit,
    onBlur,
    onClear,
    searchValue,
    inputLabel,
    hintText,
  } = useSearchControlsData();

  return (
    <div>
      <SearchField
        onSubmit={onSubmit}
        inputLabel={inputLabel}
        onBlur={onBlur}
        onClear={onClear}
        value={searchValue}
      />
      <small className="form-text text-muted search-help-text">
        {hintText}
      </small>
    </div>
  );
};

SearchControls.propTypes = {};

export default SearchControls;
