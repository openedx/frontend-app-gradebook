import React from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const withParams = WrappedComponent => {
  const WithParamsComponent = props => <WrappedComponent {...useParams()} {...props} />;
  return WithParamsComponent;
};

export const withNavigate = WrappedComponent => {
  const WithNavigateComponent = props => {
    const navigate = useNavigate();
    return <WrappedComponent navigate={navigate} {...props} />;
  };
  return WithNavigateComponent;
};

export const withLocation = WrappedComponent => {
  const WithLocationComponent = props => {
    const location = useLocation();
    return <WrappedComponent location={location} {...props} />;
  };
  return WithLocationComponent;
};
