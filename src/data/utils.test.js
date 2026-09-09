import simpleSelectorFactory from './utils';

describe('simpleSelectorFactory', () => {
  const transformer = (state) => state.slice;
  const state = { slice: { a: 1, b: 2, c: 3 } };

  it('creates one selector per key from an array', () => {
    const selectors = simpleSelectorFactory(transformer, ['a', 'b']);
    expect(selectors.a(state)).toBe(1);
    expect(selectors.b(state)).toBe(2);
  });

  it('creates selectors from Object.keys when passed an object', () => {
    const selectors = simpleSelectorFactory(transformer, { a: null, c: null });
    expect(selectors.a(state)).toBe(1);
    expect(selectors.c(state)).toBe(3);
    expect(selectors.b).toBeUndefined();
  });

  it('exposes a `root` selector that returns the full transformed slice', () => {
    const selectors = simpleSelectorFactory(transformer, ['a']);
    expect(selectors.root(state)).toEqual({ a: 1, b: 2, c: 3 });
  });
});
