import MockedMain from './Main';
import routes from './routes';

jest.mock('./Main', () => () => null);

describe('routes', () => {
  it('lazy-loads Main as the gradebook route component', async () => {
    const { Component } = await routes[0].lazy();
    expect(Component).toBe(MockedMain);
  });
});
