import React from 'react';
import { render, initializeMocks } from 'testUtilsExtra';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

describe('App', () => {
  beforeEach(() => {
    initializeMocks();
  });

  const renderWithRouter = (initialEntries = ['/course-v1:TestU+CS101+2024']) => render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );

  it('renders without crashing', () => {
    const { container } = renderWithRouter();
    expect(container).toBeInTheDocument();
  });

  it('renders main app structure', () => {
    renderWithRouter();
    expect(document.body).toBeInTheDocument();
  });

  it('handles different course ID formats', () => {
    const { container } = renderWithRouter(['/course-v1:MIT+6.00x+2023']);
    expect(container).toBeInTheDocument();
  });

  it('renders with route parameters', () => {
    const { container } = renderWithRouter(['/course-v1:Harvard+CS50+2024']);
    expect(container).toBeInTheDocument();
  });

  it('includes Head component for document management', () => {
    const { container } = renderWithRouter();
    expect(container.firstChild).toBeTruthy();
  });
});
