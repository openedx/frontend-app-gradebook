import { getAuthenticatedHttpClient } from '@openedx/frontend-base';

import {
  get, post, stringifyUrl, filterQuery,
} from './utils';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
}));

const httpMock = jest.mocked(getAuthenticatedHttpClient);

describe('lms/utils', () => {
  beforeEach(() => jest.clearAllMocks());

  it('get delegates to the authenticated http client', () => {
    const spy = jest.fn().mockReturnValue('r');
    httpMock.mockReturnValue({ get: spy });
    expect(get('/x', { params: 1 })).toBe('r');
    expect(spy).toHaveBeenCalledWith('/x', { params: 1 });
  });

  it('post delegates to the authenticated http client', () => {
    const spy = jest.fn().mockReturnValue('r');
    httpMock.mockReturnValue({ post: spy });
    post('/x', { body: 1 });
    expect(spy).toHaveBeenCalledWith('/x', { body: 1 });
  });

  it('stringifyUrl skips null and empty-string params', () => {
    expect(stringifyUrl('/x', { a: 1, b: null, c: '' })).toBe('/x?a=1');
  });

  describe('filterQuery', () => {
    it('keeps only set filters that are not "All"', () => {
      expect(filterQuery({
        cohort: 'c1', track: 'All', assignmentType: '', assignment: 'a1',
      })).toEqual({ cohort: 'c1', assignment: 'a1' });
    });

    it('returns an empty object when nothing valid is set', () => {
      expect(filterQuery({ cohort: '', track: 'All' })).toEqual({});
    });
  });
});
