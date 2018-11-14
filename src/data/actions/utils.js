
const sortAlphaDesc = (gradeRowA, gradeRowB) => {
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

const sortAlphaAsc = (gradeRowA, gradeRowB) => {
  const a = gradeRowA.username.toUpperCase();
  const b = gradeRowB.username.toUpperCase();
  if (a < b) {
    return 1;
  }
  if (a > b) {
    return -1;
  }
  return 0;
};

const sortNumerically = (colKey, direction) => {
  function sortNumAsc(gradeRowA, gradeRowB) {
    if (gradeRowA[colKey] < gradeRowB[colKey]) {
      return -1;
    }
    if (gradeRowA[colKey] > gradeRowB[colKey]) {
      return 1;
    }
    return 0;
  }

  function sortNumDesc(gradeRowA, gradeRowB) {
    if (gradeRowA[colKey] < gradeRowB[colKey]) {
      return 1;
    }
    if (gradeRowA[colKey] > gradeRowB[colKey]) {
      return -1;
    }
    return 0;
  }

  this.setState({ grades: [...this.state.grades].sort(direction === 'desc' ? sortNumDesc : sortNumAsc) });
};
const headingMapper = {
  all: (entry) => {
    if (entry) {
      const results = [{
        label: 'Username',
        key: 'username',
        columnSortable: true,
        onSort: (direction) => {
          this.setState({
            grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
          });
        },
      }];

      const assignmentHeadings = entry.section_breakdown
        .filter(section => section.is_graded && section.label)
        .map(s => ({
          label: s.label,
          key: s.label,
          columnSortable: true,
          onSort: (direction) => { this.sortNumerically(s.label, direction); },
        }));

      const totals = [{
        label: 'Total',
        key: 'total',
        columnSortable: true,
        onSort: (direction) => { this.sortNumerically('total', direction); },
      }];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  },
  hw: (entry) => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: (direction) => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
        });
      },
    }];

    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Homework')
      .map(s => ({
        label: s.label,
        key: s.label,
        columnSortable: false,
        onSort: (direction) => { this.sortNumerically(s.label, direction); },
      }));

    return results.concat(assignmentHeadings);
  },
  exam: (entry) => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: false,
      onSort: (direction) => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc),
        });
      },
    }];

    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Exam')
      .map(s => ({
        label: s.label,
        key: s.label,
        columnSortable: false,
        onSort: (direction) => { this.sortNumerically(s.label, direction); },
      }));

    return results.concat(assignmentHeadings);
  },
};

export { headingMapper };
