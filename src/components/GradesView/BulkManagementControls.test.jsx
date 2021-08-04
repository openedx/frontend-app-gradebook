import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { views } from 'data/constants/app';

import {
  BulkManagementControls,
  mapStateToProps,
  mapDispatchToProps,
} from './BulkManagementControls';

jest.mock('./ImportGradesButton', () => 'ImportGradesButton');
jest.mock('components/NetworkButton', () => 'NetworkButton');
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      gradeExportUrl: (state) => ({ gradeExportUrl: state }),
      interventionExportUrl: (state) => ({ interventionExportUrl: state }),
      showBulkManagement: (state) => ({ showBulkManagement: state }),
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    app: { setView: jest.fn() },
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
        setView: jest.fn(),
      };
    });
    test('snapshot - empty if showBulkManagement is not truthy', () => {
      expect(shallow(<BulkManagementControls {...props} />)).toEqual({});
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
      describe('handleViewActivityLog', () => {
        it('calls props.setView(views.bulkManagementHistory)', () => {
          el.instance().handleViewActivityLog();
          expect(props.setView).toHaveBeenCalledWith(views.bulkManagementHistory);
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
    test('showBulkManagement from root.showBulkManagement', () => {
      expect(mapped.showBulkManagement).toEqual(selectors.root.showBulkManagement(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('downloadBulkGradesReport from actions.grades.downloadReport.bulkGrades', () => {
      expect(
        mapDispatchToProps.downloadBulkGradesReport,
      ).toEqual(actions.grades.downloadReport.bulkGrades);
    });
    test('setView from actions.app.setView', () => {
      expect(mapDispatchToProps.setView).toEqual(actions.app.setView);
    });
  });
});
