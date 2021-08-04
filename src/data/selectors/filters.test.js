import initialFilters, { filters as filterNames } from 'data/constants/filters';
// import * in order to mock in-file references
import * as selectors from './filters';
// import default export in order to test simpleSelectors not exported individually
import exportedSelectors from './filters';

const selectedAssignmentInfo = {
  type: 'Homework',
  id: 'block-v1:edX+type@sequential+block@abcde',
  label: 'HW 01',
  subsectionLabel: 'Example Week 1: Getting Started',
};

const filters = {
  [filterNames.assignment]: selectedAssignmentInfo,
  [filterNames.assignmentGradeMax]: '100',
  [filterNames.assignmentGradeMin]: '0',
  [filterNames.assignmentType]: 'Homework',
  [filterNames.cohort]: 'Spring Term',
  [filterNames.courseGradeMax]: '100',
  [filterNames.courseGradeMin]: '0',
  [filterNames.includeCourseRoleMembers]: false,
  [filterNames.track]: 'masters',
};

const noFilters = {
  [filterNames.assignment]: undefined,
  [filterNames.assignmentGradeMax]: '100',
  [filterNames.assignmentGradeMin]: '0',
  [filterNames.assignmentType]: 'All',
  [filterNames.cohort]: '',
  [filterNames.courseGradeMax]: '100',
  [filterNames.courseGradeMin]: '0',
  [filterNames.includeCourseRoleMembers]: false,
  [filterNames.track]: '',
};

const sectionBreakdowns = [
  {
    subsection_name: 'Example Week 1: Getting Started',
    score_earned: 1,
    score_possible: 1,
    percent: 1,
    displayed_value: '1.00',
    grade_description: '(0.00/0.00)',
    module_id: 'block-v1:edX+type@sequential+block@abcde',
    label: 'HW 01',
    category: 'Homework',
  },
  {
    subsection_name: 'Example Week 2: Going Deeper',
    score_earned: 1,
    score_possible: 42,
    percent: 0,
    displayed_value: '0.02',
    grade_description: '(0.00/0.00)',
    module_id: 'block-v1:edX+type@sequential+block@bcdef',
    label: 'LAB 01',
    category: 'Labs',
  },
];

const gradesData = { results: [{ section_breakdown: sectionBreakdowns }] };

const testState = {
  filters,
  grades: gradesData,
};

describe('filters selectors', () => {
  describe('chooseRelevantAssignmentData', () => {
    it('maps label, subsection, category, and ID from assignment data', () => {
      const assignmentData = selectors.chooseRelevantAssignmentData(sectionBreakdowns[0]);
      expect(assignmentData).toEqual(selectedAssignmentInfo);
    });
  });

  describe('isDefault', () => {
    it('returns true iff value is equal to initialFilters[name]', () => {
      expect(
        selectors.isDefault(filterNames.assignment, initialFilters[filterNames.assignment]),
      ).toEqual(true);
      expect(
        selectors.isDefault(filterNames.assignment, 'bananas'),
      ).toEqual(false);
    });
  });

  describe('getAssignmentsFromResultsSubstate', () => {
    it('gets section breakdowns from state', () => {
      const assignments = selectors.getAssignmentsFromResultsSubstate(gradesData.results);
      expect(assignments).toEqual(sectionBreakdowns);
    });
    it('returns an empty array when results are not supplied', () => {
      const assignments = selectors.getAssignmentsFromResultsSubstate([]);
      expect(assignments).toEqual([]);
    });
    it('returns an empty array when section breakdowns are not supplied', () => {
      const assignments = selectors.getAssignmentsFromResultsSubstate([{}]);
      expect(assignments).toEqual([]);
    });
  });

  describe('relevantAssignmentDataFromResults', () => {
    it('grabs relevant assignment data from the grades substate with matching id', () => {
      const ids = ['some', 'fake', 'ids'];
      const grades = { gradeIds: ids };

      const getFromSubstate = selectors.getAssignmentsFromResultsSubstate;
      selectors.getAssignmentsFromResultsSubstate = jest.fn(
        ({ gradeIds }) => gradeIds,
      );
      const mapper = selectors.chooseRelevantAssignmentData;
      selectors.chooseRelevantAssignmentData = jest.fn((id) => ({ id }));
      expect(selectors.relevantAssignmentDataFromResults(grades, ids[2])).toEqual(
        { id: ids[2] },
      );
      selectors.getAssignmentsFromResultsSubstate = getFromSubstate;
      selectors.chooseRelevantAssignmentData = mapper;
    });
  });

  describe('allFilters', () => {
    it('selects all filters from state', () => {
      const allFilters = selectors.allFilters(testState);
      expect(allFilters).toEqual(filters);
    });
    it('returns an empty object when no filters are in state', () => {
      const allFilters = selectors.allFilters({});
      expect(allFilters).toEqual({});
    });
  });

  describe('areAssignmentGradeFiltersSet', () => {
    it('returns true iff either assignmentGradeMax or assignmentGradeMin is set', () => {
      expect(selectors.areAssignmentGradeFiltersSet({ filters: { assignmentGradeMax: '23' } })).toEqual(true);
      expect(selectors.areAssignmentGradeFiltersSet({ filters: { assignmentGradeMin: '42' } })).toEqual(true);
      expect(selectors.areAssignmentGradeFiltersSet({ filters: {} })).toEqual(false);
    });
  });

  describe('excludedCourseRoles', () => {
    it('returns empty string if includeCourseRoleMembers', () => {
      expect(selectors.excludedCourseRoles({ filters: { includeCourseRoleMembers: true } })).toEqual('');
    });
    it('returns "all" string if not includeCourseRoleMembers', () => {
      expect(selectors.excludedCourseRoles({ filters: { includeCourseRoleMembers: false } })).toEqual('all');
    });
  });

  describe('selectedAssignmentId', () => {
    it('gets filtered assignment ID when available', () => {
      const assignmentId = selectors.selectedAssignmentId(testState);
      expect(assignmentId).toEqual(filters.assignment.id);
    });
    it('returns undefined when assignment ID unavailable', () => {
      const assignmentId = selectors.selectedAssignmentId({ filters: { assignment: undefined } });
      expect(assignmentId).toEqual(undefined);
    });
  });

  describe('selectedAssignmentLabel', () => {
    it('gets filtered assignment label when available', () => {
      const assignmentLabel = selectors.selectedAssignmentLabel(testState);
      expect(assignmentLabel).toEqual(filters.assignment.label);
    });
    it('returns undefined when assignment label is unavailable', () => {
      const assignmentLabel = selectors.selectedAssignmentLabel({ filters: { assignment: undefined } });
      expect(assignmentLabel).toEqual(undefined);
    });
  });

  describe('selectableAssignmentLabels', () => {
    it('gets assignment data for sections matching selected type filters', () => {
      const selectableAssignmentLabels = selectors.selectableAssignmentLabels(testState);
      expect(selectableAssignmentLabels).toEqual([filters.assignment]);
    });
  });

  describe('selectableAssignments', () => {
    it('returns all graded assignments when no assignment type filtering is applied', () => {
      const selectableAssignments = selectors.selectableAssignments({ grades: gradesData, filters: noFilters });
      expect(selectableAssignments).toEqual(sectionBreakdowns);
    });
    it('gets assignments of the selected category when assignment type filtering is applied', () => {
      const selectableAssignments = selectors.selectableAssignments(testState);
      expect(selectableAssignments).toEqual([sectionBreakdowns[0]]);
    });
  });

  describe('simpleSelectors', () => {
    const testVal = 'some Test Value';
    const testSimpleSelector = (key) => {
      test(key, () => {
        expect(exportedSelectors[key]({ filters: { [key]: testVal } })).toEqual(testVal);
      });
    };
    testSimpleSelector('assignment');
    testSimpleSelector('assignmentGradeMax');
    testSimpleSelector('assignmentGradeMin');
    testSimpleSelector('assignmentType');
    testSimpleSelector('cohort');
    testSimpleSelector('courseGradeMax');
    testSimpleSelector('courseGradeMin');
    testSimpleSelector('track');
    testSimpleSelector('includeCourseRoleMembers');
    test('selectedAssignmentId', () => {
      expect(
        selectors.selectedAssignmentId({ filters: { assignment: { id: testVal } } }),
      ).toEqual(testVal);
    });
    test('selectedAssignmentLabel', () => {
      expect(
        selectors.selectedAssignmentLabel({ filters: { assignment: { label: testVal } } }),
      ).toEqual(testVal);
    });
  });
});
