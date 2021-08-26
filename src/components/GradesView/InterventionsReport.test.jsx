import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import actions from 'data/actions';

import {
  InterventionsReport,
  mapStateToProps,
  mapDispatchToProps,
} from './InterventionsReport';

jest.mock('@edx/paragon', () => ({
  Toast: () => 'Toast',
}));
jest.mock('components/NetworkButton', () => 'NetworkButton');
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      interventionExportUrl: (state) => ({ interventionExportUrl: state }),
      showBulkManagement: (state) => ({ showBulkManagement: state }),
    },
  },
}));
jest.mock('data/actions', () => ({
  __esModule: true,
  default: {
    grades: {
      downloadReport: { intervention: jest.fn() },
    },
  },
}));

describe('InterventionsReport component', () => {
  let el;
  let props = {
    interventionExportUrl: 'url.for.exporting.interventions',
    showBulkManagement: true,
  };
  let location;
  beforeAll(() => {
    location = window.location;
  });
  beforeEach(() => {
    delete window.location;
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(location),
        assign: { configurable: true, value: jest.fn() },
      },
    );
    props = {
      ...props,
      downloadInterventionReport: jest.fn(),
    };
  });
  afterAll(() => {
    window.location = location;
  });
  describe('snapshots', () => {
    beforeEach(() => {
      el = shallow(<InterventionsReport {...props} />);
    });
    test('snapshot', () => {
      el.instance().handleClick = jest.fn().mockName('handleClick');
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('returns empty if props.showBulkManagement is false', () => {
      el.setProps({ showBulkManagement: false });
      expect(el.instance().render()).toEqual(false);
    });
  });
  describe('behavior', () => {
    beforeEach(() => {
      el = shallow(<InterventionsReport {...props} />);
    });
    describe('handleClick', () => {
      it('calls props.downloadInterventionReport and navigates to props.interventionExportUrl', () => {
        el.instance().handleClick();
        expect(props.downloadInterventionReport).toHaveBeenCalled();
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { somewhere: 'over', the: 'rainbow' };
    const mapped = mapStateToProps(testState);
    test('interventionExportUrl from root interventionExportUrl selector', () => {
      expect(mapped.interventionExportUrl).toEqual(
        selectors.root.interventionExportUrl(testState),
      );
    });
    test('showBulkManagement from root showBulkManagement selector', () => {
      expect(mapped.showBulkManagement).toEqual(
        selectors.root.showBulkManagement(testState),
      );
    });
  });
  describe('mapDispatchToProps', () => {
    test('downloadInterventionReport from actions.grades.downloadReport.intervention', () => {
      expect(mapDispatchToProps.downloadInterventionReport).toEqual(
        actions.grades.downloadReport.intervention,
      );
    });
  });
});
