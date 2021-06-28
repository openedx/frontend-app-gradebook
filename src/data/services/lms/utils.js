import queryString from 'query-string';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { filters } from 'data/constants/filters';

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
