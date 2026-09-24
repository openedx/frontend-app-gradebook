import { getSiteConfig } from '@openedx/frontend-base';

import { historyRecordLimit } from './constants';
import * as utils from './utils';
import urls, {
  bulkGradesUrlByRow,
  gradeCsvUrl,
  instructorDashboardUrl,
  interventionExportCsvUrl,
  sectionOverrideHistoryUrl,
} from './urls';

jest.mock('./utils', () => ({
  filterQuery: jest.fn(options => ({ filterQuery: options })),
  stringifyUrl: jest.fn((url, query) => ({ url, query })),
}));

describe('lms api url methods', () => {
  const courseId = 'course-v1:TestU+CS101+2024';

  describe('bulkGradesUrlByRow', () => {
    it('returns bulkGrades url with error_id', () => {
      const id = 'heyo';
      expect(bulkGradesUrlByRow(courseId, id)).toEqual(
        utils.stringifyUrl(urls.getBulkGradesUrl(courseId), { error_id: id }),
      );
    });
  });
  describe('gradeCsvUrl', () => {
    it('returns bulkGrades with filterQuery-loaded options as query', () => {
      const options = { some: 'fun', query: 'options' };
      expect(gradeCsvUrl(courseId, options)).toEqual(
        utils.stringifyUrl(urls.getBulkGradesUrl(courseId), utils.filterQuery(options)),
      );
    });
    it('defaults options to empty object', () => {
      expect(gradeCsvUrl(courseId)).toEqual(
        utils.stringifyUrl(urls.getBulkGradesUrl(courseId), utils.filterQuery({})),
      );
    });
  });
  describe('interventionExportCsvUrl', () => {
    it('returns intervention url with filterQuery-loaded options as query', () => {
      const options = { some: 'fun', query: 'options' };
      expect(interventionExportCsvUrl(courseId, options)).toEqual(
        utils.stringifyUrl(urls.getInterventionUrl(courseId), utils.filterQuery(options)),
      );
    });
    it('defaults options to empty object', () => {
      expect(interventionExportCsvUrl(courseId)).toEqual(
        utils.stringifyUrl(urls.getInterventionUrl(courseId), utils.filterQuery({})),
      );
    });
  });
  describe('instructorDashboardUrl', () => {
    it('returns the LMS dashboard url for the given courseId', () => {
      expect(instructorDashboardUrl(courseId)).toEqual(
        `${getSiteConfig().lmsBaseUrl}/courses/${courseId}/instructor`,
      );
    });
  });
  describe('sectionOverrideHistoryUrl', () => {
    it('returns grades url with subsection id, and user_id/history_record_limit query', () => {
      const subsectionId = 'a sub section';
      const userId = 'Tom';
      expect(sectionOverrideHistoryUrl(subsectionId, userId)).toEqual(
        utils.stringifyUrl(
          `${urls.getGradesUrl()}subsection/${subsectionId}/`,
          { user_id: userId, history_record_limit: historyRecordLimit },
        ),
      );
    });
  });
});
