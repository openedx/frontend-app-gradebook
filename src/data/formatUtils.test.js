import { formatDateForDisplay, sortAlphaAsc } from './formatUtils';

describe('formatDateForDisplay', () => {
  it('formats a Date as "Month D, YYYY at HH:MM TZ" in UTC', () => {
    const formatted = formatDateForDisplay(new Date('2024-03-15T08:05:00Z'));
    expect(formatted).toContain('March 15, 2024');
    expect(formatted).toContain(' at ');
    expect(formatted).toMatch(/\d{2}:\d{2}/);
    expect(formatted).toContain('UTC');
  });
});

describe('sortAlphaAsc', () => {
  it('returns -1 when a < b (case-insensitive)', () => {
    expect(sortAlphaAsc({ username: 'alice' }, { username: 'bob' })).toBe(-1);
  });

  it('returns 1 when a > b (case-insensitive)', () => {
    expect(sortAlphaAsc({ username: 'bob' }, { username: 'alice' })).toBe(1);
  });

  it('returns 0 when usernames match ignoring case', () => {
    expect(sortAlphaAsc({ username: 'alice' }, { username: 'ALICE' })).toBe(0);
  });
});
