import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';

import GradebookFilters from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const updateQueryParams = jest.fn();

initializeMocks();

describe('GradebookFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<GradebookFilters updateQueryParams={updateQueryParams} />);
  });
  describe('All filters render together', () => {
    test('Assignment filters', () => {
      expect(screen.getByRole('combobox', { name: 'Assignment Types' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Assignment' })).toBeInTheDocument();
    });
    test('CourseGrade filters', () => {
      expect(screen.getByRole('button', { name: 'Overall Grade' })).toBeInTheDocument();
    });
    test('StudentGroups filters', () => {
      expect(screen.getByRole('button', { name: 'Student Groups' })).toBeInTheDocument();
    });
    test('includeCourseTeamMembers', () => {
      expect(screen.getByRole('button', { name: 'Include Course Team Members' })).toBeInTheDocument();
    });
  });
});
