const formatDateForDisplay = (inputDate) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };
  return `${inputDate.toLocaleDateString('en-US', options)} at ${inputDate.toLocaleTimeString('en-US', timeOptions)}`;
};

const sortAlphaAsc = (gradeRowA, gradeRowB) => {
  const a = gradeRowA.username.toUpperCase();
  const b = gradeRowB.username.toUpperCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const headingMapper = (filterKey) => {
  const filters = {
    all: section => section.label,
    some: section => section.label && section.category === filterKey,
  };

  const filter = filterKey === 'All' ? 'all' : 'some';

  return (entry) => {
    if (entry) {
      const results = ['Username', 'Email'];

      const assignmentHeadings = entry.section_breakdown
        .filter(filters[filter])
        .map(s => s.label);

      const totals = ['Total'];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  };
};

export { headingMapper, sortAlphaAsc, formatDateForDisplay };

