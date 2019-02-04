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
  function all(entry) {
    if (entry) {
      const results = [{
        label: 'Username',
        key: 'username',
      }];

      const assignmentHeadings = entry.section_breakdown
        .filter(section => section.label)
        .map(s => ({
          label: s.label,
          key: s.label,
        }));

      const totals = [{
        label: 'Total',
        key: 'total',
      }];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  }

  function some(entry) {
    if (!entry) return [];

    const results = [{
      label: 'Username',
      key: 'username',
    }];

    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.label && section.category === filterKey)
      .map(s => ({
        label: s.label,
        key: s.label,
      }));

    const totals = [{
      label: 'Total',
      key: 'total',
    }];

    return results.concat(assignmentHeadings).concat(totals);
  }

  return filterKey === 'All' ? all : some;
};

export { headingMapper, sortAlphaAsc };

