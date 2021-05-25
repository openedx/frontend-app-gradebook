/**
 * testActionTypes(actionTypes, dataKey)
 * Takes a list of actionTypes and a module dataKey, and verifies that
 *  * all actionTypes are unique
 *  * all actionTypes begin with the dataKey
 * @param {string[]} actionTypes - list of action types
 * @param {string} dataKey - module data key
 */
export const testActionTypes = (actionTypes, dataKey) => {
  test('all types are unique', () => {
    expect(actionTypes.length).toEqual((new Set(actionTypes)).size);
  });
  test('all types begin with the module dataKey', () => {
    actionTypes.forEach(type => {
      expect(type.startsWith(dataKey)).toEqual(true);
    });
  });
};

/**
 * testAction(action, args, expectedPayload)
 * Multi-purpose action creator test function.
 * If args/expectedPayload are passed, verifies that it produces the expected output when called
 * with the given args.
 * If none are passed, (for action creators with basic definition) it tests against a default
 * test payload.
 * @param {object} action - action creator object/method
 * @param {[object]} args - optional payload argument
 * @param {[object]} expectedPayload - optional expected payload.
 */
export const testAction = (action, args, expectedPayload) => {
  const type = action.toString();
  if (args) {
    if (Array.isArray(args)) {
      expect(action(...args)).toEqual({ type, payload: expectedPayload });
    } else {
      expect(action(args)).toEqual({ type, payload: expectedPayload });
    }
  } else {
    const payload = { test: 'PAYload' };
    expect(action(payload)).toEqual({ type, payload });
  }
};

export default {
  testAction,
  testActionTypes,
};
