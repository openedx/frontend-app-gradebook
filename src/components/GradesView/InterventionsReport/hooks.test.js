import { actions, selectors } from 'data/redux/hooks';

import useInterventionsReportData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: {
      useDownloadInterventionReport: jest.fn(),
    },
  },
  selectors: {
    root: {
      useInterventionExportUrl: jest.fn(),
      useShowBulkManagement: jest.fn(),
    },
  },
}));

const downloadReport = jest.fn();
actions.grades.useDownloadInterventionReport.mockReturnValue(downloadReport);
selectors.root.useShowBulkManagement.mockReturnValue(true);
const exportUrl = 'test-intervention-export-url';
selectors.root.useInterventionExportUrl.mockReturnValue(exportUrl);

let hook;
let oldLocation;
describe('useInterventionsReportData hooks', () => {
  beforeEach(() => {
    oldLocation = window.location;
    delete window.location;
    window.location = { assign: jest.fn() };
    hook = useInterventionsReportData();
  });
  afterEach(() => {
    window.location = oldLocation;
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(selectors.root.useInterventionExportUrl).toHaveBeenCalled();
      expect(selectors.root.useShowBulkManagement).toHaveBeenCalled();
      expect(actions.grades.useDownloadInterventionReport).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    test('show from showBulkManagement selector', () => {
      expect(hook.show).toEqual(true);
    });
    describe('handleClick', () => {
      it('downloads interventions report and navigates to export url', () => {
        hook.handleClick();
        expect(downloadReport).toHaveBeenCalled();
        expect(window.location.assign).toHaveBeenCalledWith(exportUrl);
      });
    });
  });
});
