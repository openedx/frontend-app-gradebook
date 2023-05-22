import React from 'react';
import { shallow } from 'enzyme';

import useBulkManagementControlsData from './hooks';
import BulkManagementControls from '.';

jest.mock('../ImportGradesButton', () => 'ImportGradesButton');
jest.mock('components/NetworkButton', () => 'NetworkButton');

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  show: true,
  handleClickExportGrades: jest.fn(),
};
useBulkManagementControlsData.mockReturnValue(hookProps);

describe('BulkManagementControls', () => {
  describe('behavior', () => {
    shallow(<BulkManagementControls />);
    expect(useBulkManagementControlsData).toHaveBeenCalledWith();
  });
  describe('render', () => {
    test('snapshot - show - network and import buttons', () => {
      expect(shallow(<BulkManagementControls />)).toMatchSnapshot();
    });
    test('snapshot - empty if show is not truthy', () => {
      useBulkManagementControlsData.mockReturnValueOnce({ ...hookProps, show: false });
      expect(shallow(<BulkManagementControls />).isEmptyRender()).toEqual(true);
    });
  });
});
