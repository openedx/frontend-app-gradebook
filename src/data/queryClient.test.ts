import { QueryClient } from '@tanstack/react-query';
import { makeQueryClient } from './queryClient';

describe('makeQueryClient', () => {
  const client = makeQueryClient();
  const { queries } = client.getDefaultOptions();

  it('returns a QueryClient instance', () => {
    expect(client).toBeInstanceOf(QueryClient);
  });

  it('uses a 5-minute staleTime and disables refetchOnWindowFocus', () => {
    expect(queries?.staleTime).toBe(5 * 60 * 1000);
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  describe('retry rule', () => {
    const retry = queries?.retry as (n: number, e: unknown) => boolean;

    it('does not retry 4xx client errors', () => {
      expect(retry(0, { response: { status: 400 } })).toBe(false);
      expect(retry(0, { response: { status: 404 } })).toBe(false);
      expect(retry(0, { response: { status: 499 } })).toBe(false);
    });

    it('retries 5xx server errors up to 3 attempts', () => {
      expect(retry(0, { response: { status: 500 } })).toBe(true);
      expect(retry(2, { response: { status: 502 } })).toBe(true);
      expect(retry(3, { response: { status: 500 } })).toBe(false);
    });

    it('retries network errors (no response) up to 3 attempts', () => {
      expect(retry(0, new Error('network'))).toBe(true);
      expect(retry(3, new Error('network'))).toBe(false);
    });
  });
});
