import config, { initialState } from './config';
import actions from '../actions/config';

const testingState = {
  abitraryField: 'abitrary',
};

describe('config reducer', () => {
  it('has initial state', () => {
    expect(
      config(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.gotBulkManagementConfig', () => {
    it('replace bulkManagementAvailable', () => {
      const expectedBulkManagementAvailable = true;
      const expected = {
        ...testingState,
        bulkManagementAvailable: expectedBulkManagementAvailable,
      };
      expect(
        config(testingState, actions.gotBulkManagementConfig(expectedBulkManagementAvailable)),
      ).toEqual(expected);
    });
  });
});
