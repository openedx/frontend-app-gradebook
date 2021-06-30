import { historyRecordLimit } from './constants';
import * as utils from './utils';
import urls, {
  bulkGradesUrlByRow,
  gradeCsvUrl,
  interventionExportCsvUrl,
  sectionOverrideHistoryUrl,
} from './urls';

jest.mock('./utils', () => ({
  filterQuery: jest.fn(options => ({ filterQuery: options })),
  stringifyUrl: jest.fn((url, query) => ({ url, query })),
}));

describe('lms api url methods', () => {
  describe('bulkGradesUrlByRow', () => {
    it('returns bulkGrades url with error_id', () => {
      const id = 'heyo';
      expect(bulkGradesUrlByRow(id)).toEqual(
        utils.stringifyUrl(urls.bulkGrades, { error_id: id }),
      );
    });
  });
  describe('gradeCsvUrl', () => {
    it('returns bulkGrades with filterQuery-loaded options as query', () => {
      const options = { some: 'fun', query: 'options' };
      expect(gradeCsvUrl(options)).toEqual(
        utils.stringifyUrl(urls.bulkGrades, utils.filterQuery(options)),
      );
    });
    it('defaults options to empty object', () => {
      expect(gradeCsvUrl()).toEqual(
        utils.stringifyUrl(urls.bulkGrades, utils.filterQuery({})),
      );
    });
  });
  describe('interventionExportCsvUrl', () => {
    it('returns intervention url with filterQuery-loaded options as query', () => {
      const options = { some: 'fun', query: 'options' };
      expect(interventionExportCsvUrl(options)).toEqual(
        utils.stringifyUrl(urls.intervention, utils.filterQuery(options)),
      );
    });
    it('defaults options to empty object', () => {
      expect(interventionExportCsvUrl()).toEqual(
        utils.stringifyUrl(urls.intervention, utils.filterQuery({})),
      );
    });
  });
  describe('sectionOverrideHistoryUrl', () => {
    it('returns grades url with subsection id, and user_id/history_record_limit query', () => {
      const subsectionId = 'a sub section';
      const userId = 'Tom';
      expect(sectionOverrideHistoryUrl(subsectionId, userId)).toEqual(
        utils.stringifyUrl(
          `${urls.grades}subsection/${subsectionId}/`,
          { user_id: userId, history_record_limit: historyRecordLimit },
        ),
      );
    });
  });
});
