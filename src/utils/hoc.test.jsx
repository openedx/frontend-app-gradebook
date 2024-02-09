import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { withLocation, withNavigate } from './hoc';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigator,
  useLocation: () => ({
    pathname: '/current-location',
  }),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ navigate, location }) => (
  // eslint-disable-next-line react/button-has-type, react/prop-types
  <button id="btn" onClick={() => navigate('/some-route')}>{location.pathname}</button>
);
const WrappedComponent = withNavigate(withLocation(MockComponent));

test('Provide Navigation to Component', () => {
  const wrapper = render(
    <WrappedComponent />,
  );
  const btn = wrapper.container.querySelector('#btn');
  fireEvent.click(btn);

  expect(mockedNavigator).toHaveBeenCalledWith('/some-route');
});

test('Provide Location object to Component', () => {
  const wrapper = render(
    <WrappedComponent />,
  );

  expect(wrapper.container.querySelector('#btn').textContent).toContain('/current-location');
});
