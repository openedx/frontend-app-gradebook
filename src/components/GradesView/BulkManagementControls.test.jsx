import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';

import {
  BulkManagementControls,
  basicButtonProps,
  buttonStates,
  mapStateToProps,
  mapDispatchToProps,
} from './BulkManagementControls';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      gradeExportUrl: (state) => ({ gradeExportUrl: state }),
      interventionExportUrl: (state) => ({ interventionExportUrl: state }),
      showBulkManagement: (state) => ({ showBulkManagement: state }),
      shouldShowSpinner: (state) => ({ showSpinner: state }),
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    grades: {
      downloadReport: {
        bulkGrades: jest.fn(),
        intervention: jest.fn(),
      },
    },
  },
}));

describe('BulkManagementControls', () => {
  describe('component', () => {
    let el;
    let props = {
      gradeExportUrl: 'gradesGoHere',
      interventionExportUrl: 'interventionsGoHere',
    };
    beforeEach(() => {
      props = {
        ...props,
        downloadBulkGradesReport: jest.fn(),
        downloadInterventionReport: jest.fn(),
      };
    });
    test('snapshot - empty if showBulkManagement is not truthy', () => {
      expect(shallow(<BulkManagementControls {...props} />)).toEqual({});
    });
    test('snapshot - buttonProps for each button ("Bulk Management" and "Interventions")', () => {
      el = shallow(<BulkManagementControls {...props} showBulkManagement />);
      jest.spyOn(el.instance(), 'buttonProps').mockImplementation(
        value => ({ buttonProps: value }),
      );
      jest.spyOn(el.instance(), 'handleClickExportGrades').mockName('this.handleClickExportGrades');
      jest.spyOn(
        el.instance(),
        'handleClickDownloadInterventions',
      ).mockName('this.handleClickDownloadInterventions');
    });
    describe('behavior', () => {
      const oldWindowLocation = window.location;

      beforeAll(() => {
        delete window.location;
        window.location = Object.defineProperties(
          {},
          {
            ...Object.getOwnPropertyDescriptors(oldWindowLocation),
            assign: {
              configurable: true,
              value: jest.fn(),
            },
          },
        );
      });
      beforeEach(() => {
        window.location.assign.mockReset();
        el = shallow(<BulkManagementControls {...props} showBulkManagement />);
      });
      afterAll(() => {
        // restore `window.location` to the `jsdom` `Location` object
        window.location = oldWindowLocation;
      });

      describe('buttonProps', () => {
        test('loads default and pending labels based on passed string', () => {
          const label = 'Fake Label';
          const { labels, state, ...rest } = el.instance().buttonProps(label);
          expect(rest).toEqual(basicButtonProps());
          expect(labels).toEqual({ default: label, pending: label });
        });
        test('loads pending state if props.showSpinner', () => {
          const label = 'Fake Label';
          el.setProps({ showSpinner: true });
          const { labels, state, ...rest } = el.instance().buttonProps(label);
          expect(state).toEqual(buttonStates.pending);
          expect(rest).toEqual(basicButtonProps());
        });
        test('loads default state if not props.showSpinner', () => {
          const label = 'Fake Label';
          const { labels, state, ...rest } = el.instance().buttonProps(label);
          expect(state).toEqual(buttonStates.default);
          expect(rest).toEqual(basicButtonProps());
        });
      });
      describe('handleClickDownloadInterventions', () => {
        const assertions = [
          'calls props.downloadInterventionReport',
          'sets location to props.interventionsExportUrl',
        ];
        it(assertions.join(' and '), () => {
          el.instance().handleClickDownloadInterventions();
          expect(props.downloadInterventionReport).toHaveBeenCalled();
          expect(window.location.assign).toHaveBeenCalledWith(props.interventionExportUrl);
        });
      });
      describe('handleClickExportGrades', () => {
        const assertions = [
          'calls props.downloadBulkGradesReport',
          'sets location to props.gradeExportUrl',
        ];
        it(assertions.join(' and '), () => {
          el.instance().handleClickExportGrades();
          expect(props.downloadBulkGradesReport).toHaveBeenCalled();
          expect(window.location.assign).toHaveBeenCalledWith(props.gradeExportUrl);
        });
      });
    });
  });

  describe('mapStateToProps', () => {
    let mapped;
    const testState = { do: 'not', test: 'me' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('gradeExportUrl from root.gradeExportUrl', () => {
      expect(mapped.gradeExportUrl).toEqual(selectors.root.gradeExportUrl(testState));
    });
    test('interventionExportUrl from root.interventionExportUrl', () => {
      expect(mapped.interventionExportUrl).toEqual(selectors.root.interventionExportUrl(testState));
    });
    test('showBulkManagement from root.showBulkManagement', () => {
      expect(mapped.showBulkManagement).toEqual(selectors.root.showBulkManagement(testState));
    });
    test('showSpinner from root.shouldShowSpinner', () => {
      expect(mapped.showSpinner).toEqual(selectors.root.shouldShowSpinner(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('downloadBulkGradesReport from actions.grades.downloadReport.bulkGrades', () => {
      expect(
        mapDispatchToProps.downloadBulkGradesReport,
      ).toEqual(actions.grades.downloadReport.bulkGrades);
    });
    test('downloadInterventionReport from actions.grades.downloadReport.invervention', () => {
      expect(
        mapDispatchToProps.downloadInterventionReport,
      ).toEqual(actions.grades.downloadReport.intervention);
    });
  });
});
