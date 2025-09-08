import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';

import SelectGroup from '../SelectGroup';
import { StudentGroupsFilter } from './index';
import useStudentGroupsFilterData from './hooks';

jest.mock('../SelectGroup', () => jest.fn(() => <div data-testid="select-group">SelectGroup</div>));
jest.mock('./hooks', () => jest.fn());

initializeMocks();

describe('StudentGroupsFilter', () => {
  const mockUpdateQueryParams = jest.fn();

  const mockTracksData = {
    value: 'test-track-value',
    entries: [
      { value: 'track1', name: 'Track 1' },
      { value: 'track2', name: 'Track 2' },
    ],
    handleChange: jest.fn(),
  };

  const mockCohortsData = {
    value: 'test-cohort-value',
    entries: [
      { value: 'cohort1', name: 'Cohort 1' },
      { value: 'cohort2', name: 'Cohort 2' },
    ],
    handleChange: jest.fn(),
    isDisabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useStudentGroupsFilterData.mockReturnValue({
      tracks: mockTracksData,
      cohorts: mockCohortsData,
    });
  });

  it('calls useStudentGroupsFilterData hook with updateQueryParams', () => {
    render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

    expect(useStudentGroupsFilterData).toHaveBeenCalledWith({
      updateQueryParams: mockUpdateQueryParams,
    });
  });

  it('renders two SelectGroup components', () => {
    render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

    expect(SelectGroup).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId('select-group')).toHaveLength(2);
  });

  describe('tracks SelectGroup', () => {
    it('renders tracks SelectGroup with correct props', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const tracksCall = SelectGroup.mock.calls[0][0];
      expect(tracksCall.id).toBe('Tracks');
      expect(tracksCall.value).toBe(mockTracksData.value);
      expect(tracksCall.onChange).toBe(mockTracksData.handleChange);
    });

    it('includes trackAll option in tracks SelectGroup', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const tracksCall = SelectGroup.mock.calls[0][0];
      const { options } = tracksCall;

      expect(options).toHaveLength(3);
      expect(options[0].props.value).toBeDefined();
      expect(options[0].props.children).toBeDefined();
    });

    it('includes track entries in tracks SelectGroup options', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const tracksCall = SelectGroup.mock.calls[0][0];
      const { options } = tracksCall;

      expect(options[1].props.value).toBe('track1');
      expect(options[1].props.children).toBe('Track 1');
      expect(options[2].props.value).toBe('track2');
      expect(options[2].props.children).toBe('Track 2');
    });
  });

  describe('cohorts SelectGroup', () => {
    it('renders cohorts SelectGroup with correct props', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const cohortsCall = SelectGroup.mock.calls[1][0];
      expect(cohortsCall.id).toBe('Cohorts');
      expect(cohortsCall.value).toBe(mockCohortsData.value);
      expect(cohortsCall.onChange).toBe(mockCohortsData.handleChange);
      expect(cohortsCall.disabled).toBe(mockCohortsData.isDisabled);
    });

    it('includes cohortAll option in cohorts SelectGroup', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const cohortsCall = SelectGroup.mock.calls[1][0];
      const { options } = cohortsCall;

      expect(options).toHaveLength(3);
      expect(options[0].props.value).toBeDefined();
      expect(options[0].props.children).toBeDefined();
    });

    it('includes cohort entries in cohorts SelectGroup options', () => {
      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const cohortsCall = SelectGroup.mock.calls[1][0];
      const { options } = cohortsCall;

      expect(options[1].props.value).toBe('cohort1');
      expect(options[1].props.children).toBe('Cohort 1');
      expect(options[2].props.value).toBe('cohort2');
      expect(options[2].props.children).toBe('Cohort 2');
    });

    it('passes disabled state to cohorts SelectGroup', () => {
      useStudentGroupsFilterData.mockReturnValue({
        tracks: mockTracksData,
        cohorts: { ...mockCohortsData, isDisabled: true },
      });

      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const cohortsCall = SelectGroup.mock.calls[1][0];
      expect(cohortsCall.disabled).toBe(true);
    });
  });

  describe('with empty entries', () => {
    it('handles empty tracks entries', () => {
      useStudentGroupsFilterData.mockReturnValue({
        tracks: { ...mockTracksData, entries: [] },
        cohorts: mockCohortsData,
      });

      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const tracksCall = SelectGroup.mock.calls[0][0];
      expect(tracksCall.options).toHaveLength(1);
    });

    it('handles empty cohorts entries', () => {
      useStudentGroupsFilterData.mockReturnValue({
        tracks: mockTracksData,
        cohorts: { ...mockCohortsData, entries: [] },
      });

      render(<StudentGroupsFilter updateQueryParams={mockUpdateQueryParams} />);

      const cohortsCall = SelectGroup.mock.calls[1][0];
      expect(cohortsCall.options).toHaveLength(1);
    });
  });
});
