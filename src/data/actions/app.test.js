import { modalFieldKeys, localFilterKeys } from 'data/constants/app';
import actions, { dataKey } from './app';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.closeModal,
      actions.setCourseId,
      actions.setModalState,
      actions.setSearchValue,
      actions.setLocalFilter,
      actions.setModalStateFromTable,
      actions.setShowImportSuccessToast,
      actions.setView,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    test('closeModal action', () => testAction(actions.closeModal));
    test('setCourseId action', () => testAction(actions.setCourseId));
    test('setModalStateFromTable action', () => testAction(actions.setModalStateFromTable));
    test('setSearchValue action', () => testAction(actions.setSearchValue));
    test('setView action', () => testAction(actions.setView));
    test('setShowImportSuccessToast action', () => (
      testAction(actions.setShowImportSuccessToast)
    ));
    describe('setLocalFilter', () => {
      it('forwards all values with filter field keys and no others', () => {
        const extra = {
          take: {
            my: ['heart', 'land'],
            me: 'where I cannot stand',
          },
        };
        const payload = {
          ...Object.keys(localFilterKeys).reduce(
            (obj, key) => ({ ...obj, [key]: `${key}-value` }),
            {},
          ),
        };
        testAction(actions.setLocalFilter, { ...payload, ...extra }, payload);
      });
    });
    describe('setModalState', () => {
      it('forwards all values with modal field keys and no others', () => {
        const extra = {
          I: {
            "don't": 'care',
            "'m": 'still free',
          },
          you: {
            "can't": 'take the sky from me',
          },
        };
        const payload = {
          ...Object.keys(modalFieldKeys).reduce(
            (obj, key) => ({ ...obj, [key]: `${key}-value` }),
            {},
          ),
        };
        testAction(actions.setModalState, { ...payload, ...extra }, payload);
      });
    });
  });
});
