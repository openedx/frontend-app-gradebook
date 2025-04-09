import store from '@src/data/store';
import { actionHook } from './utils';

jest.mock('data/store', () => ({
  dispatch: jest.fn(),
}));

describe('actionHook', () => {
  it('returns a function that dispatches the action', () => {
    const action = jest.fn();
    const useHook = actionHook(action);
    const args = [1, 2, 3];
    const hook = useHook();
    hook(...args);
    expect(action).toHaveBeenCalledWith(...args);
    expect(store.dispatch).toHaveBeenCalledWith(action(...args));
  });
});
