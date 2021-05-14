/* eslint-disable import/no-extraneous-dependencies */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

export const createTestFetcher = (
  mockedMethod,
  thunkAction,
  args,
  onDispatch,
) => (
  resolveFn,
  expectedActions,
  verifyFn,
) => {
  const store = mockStore({});
  mockedMethod.mockReturnValue(new Promise(resolve => {
    resolve(new Promise(resolveFn));
  }));
  return store.dispatch(thunkAction(...args)).then(() => {
    if (onDispatch) { onDispatch(); }
    if (verifyFn) { verifyFn(); }
    if (expectedActions !== undefined) {
      expect(store.getActions()).toEqual(expectedActions);
    }
  });
};

export default {
  createTestFetcher,
};
