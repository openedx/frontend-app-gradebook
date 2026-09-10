import lms from '@src/data/services/lms';

import { getCohorts, getTracks } from './api';

jest.mock('@src/data/services/lms', () => ({
  api: { fetch: { cohorts: jest.fn(), tracks: jest.fn() } },
}));

const cohortsMock = jest.mocked(lms.api.fetch.cohorts);
const tracksMock = jest.mocked(lms.api.fetch.tracks);

describe('GradebookFilters/data api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getCohorts returns the response body', async () => {
    cohortsMock.mockResolvedValue({ data: { cohorts: [{ id: 1 }] } });
    await expect(getCohorts()).resolves.toEqual({ cohorts: [{ id: 1 }] });
  });

  it('getTracks unwraps course_modes from the response body', async () => {
    tracksMock.mockResolvedValue({ data: { course_modes: [{ slug: 'verified' }] } });
    await expect(getTracks()).resolves.toEqual([{ slug: 'verified' }]);
  });
});
