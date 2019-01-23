import { sortGrades } from './grades';

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

const sortAlphaDesc = (gradeRowA, gradeRowB) => {
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
  function getPercents(gradeRowA, gradeRowB) {
    if (colKey !== 'total') {
      return {
        a: gradeRowA.section_breakdown.find(x => x.label === colKey).percent,
        b: gradeRowB.section_breakdown.find(x => x.label === colKey).percent,
      };
    }
    return {
      a: gradeRowA.percent,
      b: gradeRowB.percent,
    };
  }

  function sortNumAsc(gradeRowA, gradeRowB) {
    const { a, b } = getPercents(gradeRowA, gradeRowB);
    return a - b;
  }

  function sortNumDesc(gradeRowA, gradeRowB) {
    const { a, b } = getPercents(gradeRowA, gradeRowB);
    return b - a;
  }

  return direction === 'desc' ? sortNumDesc : sortNumAsc;
};

function gradeSortMap(columnName, direction) {
  if (columnName === 'username' && direction === 'desc') {
    return sortAlphaDesc;
  } else if (columnName === 'username') {
    return sortAlphaAsc;
  }
  return sortNumerically(columnName, direction);
}

const headingMapper = (filterKey) => {
  function all(dispatch, entry) {
    if (entry) {
      const results = [{
        label: 'Username',
        key: 'username',
        columnSortable: true,
        onSort: (direction) => { dispatch(sortGrades('username', direction)); },
      }];

      const assignmentHeadings = entry.section_breakdown
        .filter(section => section.label)
        .map(s => ({
          label: s.label,
          key: s.label,
          columnSortable: true,
          onSort: direction => dispatch(sortGrades(s.label, direction)),
        }));

      const totals = [{
        label: 'Total',
        key: 'total',
        columnSortable: true,
        onSort: direction => dispatch(sortGrades('total', direction)),
      }];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  }

  function some(dispatch, entry) {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: (direction) => { dispatch(sortGrades('username', direction)); },
    }];

    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.label && section.category === filterKey)
      .map(s => ({
        label: s.label,
        key: s.label,
        columnSortable: false,
        onSort: (direction) => { this.sortNumerically(s.label, direction); },
      }));

    const totals = [{
      label: 'Total',
      key: 'total',
      columnSortable: true,
      onSort: direction => dispatch(sortGrades('total', direction)),
    }];

    return results.concat(assignmentHeadings).concat(totals);
  }

  return filterKey === 'All' ? all : some;
};

export { headingMapper, gradeSortMap, sortAlphaAsc };

