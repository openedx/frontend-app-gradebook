import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
}));

jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: ({ children }) => children,
}));

jest.mock('@edx/frontend-component-header', () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

jest.mock('@edx/frontend-component-footer', () => ({
  FooterSlot: () => <div>Footer</div>,
}));

jest.mock('./head/Head', () => ({
  __esModule: true,
  default: () => <div>Head</div>,
}));

jest.mock('containers/GradebookPage', () => ({
  __esModule: true,
  default: () => <div>Gradebook</div>,
}));

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Head component', () => {
    const head = screen.getByText('Head');
    expect(head).toBeInTheDocument();
  });

  it('renders Header component', () => {
    const header = screen.getByText('Header');
    expect(header).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    const footer = screen.getByText('Footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders main content wrapper', () => {
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    const gradebook = screen.getByText('Gradebook');
    expect(gradebook).toBeInTheDocument();
  });
});
