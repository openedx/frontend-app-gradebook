import React from 'react';

import { render, screen, initializeMocks } from 'testUtilsExtra';

import { GradebookPage, mapStateToProps, mapDispatchToProps } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock(
  'components/WithSidebar',
  () => function WithSidebar() {
    return <div data-testid="with-sidebar">WithSidebar</div>;
  },
);
jest.mock(
  'components/GradebookHeader',
  () => function GradebookHeader() {
    return <div data-testid="gradebook-header">GradebookHeader</div>;
  },
);
jest.mock(
  'components/GradesView',
  () => function GradesView() {
    return <div data-testid="grades-view">GradesView</div>;
  },
);
jest.mock(
  'components/GradebookFilters',
  () => function GradebookFilters() {
    return <div data-testid="gradebook-filters">GradebookFilters</div>;
  },
);
jest.mock(
  'components/BulkManagementHistoryView',
  () => function BulkManagementHistoryView() {
    return (
      <div data-testid="bulk-management-history">
        BulkManagementHistoryView
      </div>
    );
  },
);

jest.mock('data/selectors', () => ({
  app: {
    activeView: jest.fn(),
  },
}));

jest.mock('data/thunkActions', () => ({
  app: {
    initialize: jest.fn(),
  },
}));

jest.mock('query-string', () => ({
  parse: jest.fn(),
  stringify: jest.fn(),
}));

const queryString = require('query-string');
const selectors = require('data/selectors');
const thunkActions = require('data/thunkActions');

initializeMocks();

describe('GradebookPage', () => {
  const defaultProps = {
    navigate: jest.fn(),
    location: { pathname: '/gradebook', search: '?course_id=test-course' },
    courseId: 'test-course-id',
    activeView: 'grades',
    initializeApp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryString.parse.mockReturnValue({});
    queryString.stringify.mockReturnValue('course_id=test-course');
  });

  it('renders without errors', () => {
    render(<GradebookPage {...defaultProps} />);

    expect(document.body).toBeInTheDocument();
  });

  it('calls initializeApp on mount with courseId and parsed query', () => {
    const mockQuery = { assignment: 'test-assignment' };
    queryString.parse.mockReturnValue(mockQuery);

    render(<GradebookPage {...defaultProps} />);

    expect(defaultProps.initializeApp).toHaveBeenCalledWith(
      defaultProps.courseId,
      mockQuery,
    );
    expect(queryString.parse).toHaveBeenCalledWith(
      defaultProps.location.search,
    );
  });

  it('renders GradebookHeader in content area', () => {
    render(<GradebookPage {...defaultProps} />);

    expect(screen.getByText('WithSidebar')).toBeInTheDocument();
  });

  it('renders GradesView when activeView is grades', () => {
    render(<GradebookPage {...defaultProps} activeView="grades" />);

    expect(screen.getByText('WithSidebar')).toBeInTheDocument();
  });

  it('renders BulkManagementHistoryView when activeView is bulkManagementHistory', () => {
    render(
      <GradebookPage {...defaultProps} activeView="bulkManagementHistory" />,
    );

    expect(screen.getByText('WithSidebar')).toBeInTheDocument();
  });

  it('passes updateQueryParams to components', () => {
    render(<GradebookPage {...defaultProps} />);

    expect(screen.getByText('WithSidebar')).toBeInTheDocument();
  });

  describe('updateQueryParams', () => {
    it('updates query parameters and navigates', () => {
      const component = new GradebookPage(defaultProps);
      const queryParams = {
        assignment: 'new-assignment',
        student: 'student-1',
      };

      queryString.parse.mockReturnValue({ course_id: 'test-course' });
      queryString.stringify.mockReturnValue(
        'course_id=test-course&assignment=new-assignment&student=student-1',
      );

      component.updateQueryParams(queryParams);

      expect(queryString.parse).toHaveBeenCalledWith(
        defaultProps.location.search,
      );
      expect(queryString.stringify).toHaveBeenCalledWith({
        course_id: 'test-course',
        assignment: 'new-assignment',
        student: 'student-1',
      });
      expect(defaultProps.navigate).toHaveBeenCalledWith({
        pathname: defaultProps.location.pathname,
        search:
          '?course_id=test-course&assignment=new-assignment&student=student-1',
      });
    });

    it('removes query parameters when value is falsy', () => {
      const component = new GradebookPage(defaultProps);
      const queryParams = { assignment: null, student: '' };

      queryString.parse.mockReturnValue({
        course_id: 'test-course',
        assignment: 'old-assignment',
        student: 'old-student',
      });
      queryString.stringify.mockReturnValue('course_id=test-course');

      component.updateQueryParams(queryParams);

      expect(queryString.stringify).toHaveBeenCalledWith({
        course_id: 'test-course',
      });
    });
  });

  describe('mapStateToProps', () => {
    it('maps activeView from state', () => {
      const mockState = { app: { activeView: 'bulkManagementHistory' } };
      selectors.app.activeView.mockReturnValue('bulkManagementHistory');

      const result = mapStateToProps(mockState);

      expect(selectors.app.activeView).toHaveBeenCalledWith(mockState);
      expect(result).toEqual({
        activeView: 'bulkManagementHistory',
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps initializeApp action', () => {
      expect(mapDispatchToProps.initializeApp).toBe(
        thunkActions.app.initialize,
      );
    });
  });

  describe('default props', () => {
    it('has correct default location', () => {
      expect(GradebookPage.defaultProps.location).toEqual({
        pathname: '/',
        search: '',
      });
    });
  });

  describe('component lifecycle', () => {
    it('binds updateQueryParams in constructor', () => {
      const component = new GradebookPage(defaultProps);

      expect(typeof component.updateQueryParams).toBe('function');
    });
  });
});
