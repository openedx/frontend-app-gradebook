import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { gradebookQueryOptions, retryUnlessClientError, useGradebookQuery } from './query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

const useQueryMock = useQuery as jest.Mock;

describe('gradebookQueryOptions', () => {
  it('uses a 5-minute staleTime and disables refetchOnWindowFocus', () => {
    expect(gradebookQueryOptions.staleTime).toBe(5 * 60 * 1000);
    expect(gradebookQueryOptions.refetchOnWindowFocus).toBe(false);
    expect(gradebookQueryOptions.retry).toBe(retryUnlessClientError);
  });

  describe('retryUnlessClientError', () => {
    it('does not retry 4xx client errors', () => {
      expect(retryUnlessClientError(0, { response: { status: 400 } })).toBe(false);
      expect(retryUnlessClientError(0, { response: { status: 404 } })).toBe(false);
      expect(retryUnlessClientError(0, { response: { status: 499 } })).toBe(false);
    });

    it('retries 5xx server errors up to 3 attempts', () => {
      expect(retryUnlessClientError(0, { response: { status: 500 } })).toBe(true);
      expect(retryUnlessClientError(2, { response: { status: 502 } })).toBe(true);
      expect(retryUnlessClientError(3, { response: { status: 500 } })).toBe(false);
    });

    it('retries network errors (no response) up to 3 attempts', () => {
      expect(retryUnlessClientError(0, new Error('network'))).toBe(true);
      expect(retryUnlessClientError(3, new Error('network'))).toBe(false);
    });
  });
});

describe('useGradebookQuery', () => {
  const queryFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies the gradebook options to the query', () => {
    renderHook(() => useGradebookQuery({ queryKey: ['test'], queryFn }));
    expect(useQueryMock).toHaveBeenCalledWith({
      ...gradebookQueryOptions,
      queryKey: ['test'],
      queryFn,
    });
  });

  it('lets the caller override them', () => {
    renderHook(() => useGradebookQuery({ queryKey: ['test'], queryFn, retry: false }));
    expect(useQueryMock).toHaveBeenCalledWith(expect.objectContaining({ retry: false }));
  });
});
