import queryString from 'query-string';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { filters } from 'data/constants/filters';
import * as utils from './utils';

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn((url, options) => ({ url, options })),
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('lms service utils', () => {
  describe('get', () => {
    it('forwards arguments to authenticatedHttpClient().get', () => {
      const get = jest.fn((...args) => ({ get: args }));
      getAuthenticatedHttpClient.mockReturnValue({ get });
      const args = ['some', 'args', 'for', 'the', 'test'];
      expect(utils.get(...args)).toEqual(get(...args));
    });
  });
  describe('post', () => {
    it('forwards arguments to authenticatedHttpClient().post', () => {
      const post = jest.fn((...args) => ({ post: args }));
      getAuthenticatedHttpClient.mockReturnValue({ post });
      const args = ['some', 'args', 'for', 'the', 'test'];
      expect(utils.post(...args)).toEqual(post(...args));
    });
  });
  describe('stringifyUrl', () => {
    it('forwards url and query to stringifyUrl with options to skip null and ""', () => {
      const url = 'here.com';
      const query = { some: 'set', of: 'queryParams' };
      const options = { skipNull: true, skipEmptyString: true };
      expect(utils.stringifyUrl(url, query)).toEqual(
        queryString.stringifyUrl({ url, query }, options),
      );
    });
  });
  describe('filterQuery', () => {
    it('returns all filters included in validated list that are not "All"', () => {
      const goodOptions = {
        [filters.assignmentType]: 'quiz',
        [filters.courseGradeMax]: 100,
        [filters.courseGradeMin]: 1,
      };
      const extraOptions = {
        fake: 'option',
        another: 'fake one',
      };
      expect(utils.filterQuery({
        ...goodOptions,
        ...extraOptions,
        [filters.includeCourseRoleMembers]: 'All',
      })).toEqual(goodOptions);
    });
  });
});

/**
 * get(url)
 * simple wrapper providing an authenticated Http client get action
 * @param {string} url - target url
 */
export const get = (...args) => getAuthenticatedHttpClient().get(...args);
/**
 * post(url, data)
 * simple wrapper providing an authenticated Http client post action
 * @param {string} url - target url
 * @param {object|string} data - post payload
 */
export const post = (...args) => getAuthenticatedHttpClient().post(...args);

/**
 * stringifyUrl(url, query)
 * simple wrapper around queryString.stringifyUrl that sets skip behavior
 * @param {string} url - base url string
 * @param {object} query - query parameters
 */
export const stringifyUrl = (url, query) => queryString.stringifyUrl(
  { url, query },
  { skipNull: true, skipEmptyString: true },
);

/**
 * filterQuery(options)
 * Takes current filter object and returns it with only valid filters that are
 * set and have non-'All' values
 * @param {object} options - filter values
 * @return {object} - valid filters that are set and do not equal 'All'
 */
export const filterQuery = (options) => Object.values(filters)
  .filter(filter => options[filter] && options[filter] !== 'All')
  .reduce(
    (obj, filter) => ({ ...obj, [filter]: options[filter] }),
    {},
  );
