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
