import hooks from '.';

import selectors from './selectors';
import actions from './actions';
import thunkActions from './thunkActions';

jest.mock('./selectors', () => jest.fn());
jest.mock('./actions', () => jest.fn());
jest.mock('./thunkActions', () => jest.fn());

describe('redux hooks', () => {
  it('exports selectors, actions, and thunkActions', () => {
    expect(hooks.actions).toEqual(actions);
    expect(hooks.selectors).toEqual(selectors);
    expect(hooks.thunkActions).toEqual(thunkActions);
  });
});
