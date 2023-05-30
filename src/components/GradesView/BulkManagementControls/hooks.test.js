import { actions, selectors } from 'data/redux/hooks';

import useBulkManagementControlsData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: {
      useDownloadBulkGradesReport: jest.fn(),
    },
  },
  selectors: {
    root: {
      useGradeExportUrl: jest.fn(),
      useShowBulkManagement: jest.fn(),
    },
  },
}));

const downloadBulkGrades = jest.fn();
actions.grades.useDownloadBulkGradesReport.mockReturnValue(downloadBulkGrades);
const gradeExportUrl = 'test-grade-export-url';
selectors.root.useGradeExportUrl.mockReturnValue(gradeExportUrl);
selectors.root.useShowBulkManagement.mockReturnValue(true);

let hook;
describe('useBulkManagementControlsData', () => {
  const oldWindowLocation = window.location;
  beforeAll(() => {
    delete window.location;
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
        assign: { configurable: true, value: jest.fn() },
      },
    );
  });
  beforeEach(() => {
    window.location.assign.mockReset();
    hook = useBulkManagementControlsData();
  });
  afterAll(() => {
    // restore `window.location` to the `jsdom` `Location` object
    window.location = oldWindowLocation;
  });
  describe('initialization', () => {
    it('initializes redux hooks', () => {
      expect(selectors.root.useGradeExportUrl).toHaveBeenCalledWith();
      expect(selectors.root.useShowBulkManagement).toHaveBeenCalledWith();
      expect(actions.grades.useDownloadBulkGradesReport).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    it('forwards show from showBulkManagement', () => {
      expect(hook.show).toEqual(true);
      selectors.root.useShowBulkManagement.mockReturnValue(false);
      hook = useBulkManagementControlsData();
      expect(hook.show).toEqual(false);
    });
    describe('handleClickExportGrades', () => {
      beforeEach(() => {
        hook.handleClickExportGrades();
      });
      it('downloads bulk grades report', () => {
        expect(downloadBulkGrades).toHaveBeenCalledWith();
      });
      it('sets window location to grade export url', () => {
        expect(window.location.assign).toHaveBeenCalledWith(gradeExportUrl);
      });
    });
  });
});
