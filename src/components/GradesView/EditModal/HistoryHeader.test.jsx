import React from 'react';
import { renderWithAllProviders, initializeMocks } from '@src/testUtils';
import { screen } from '@testing-library/react';

import HistoryHeader from './HistoryHeader';

initializeMocks();

describe('HistoryHeader', () => {
  const defaultProps = {
    id: 'test-id',
    label: 'Test Label',
    value: 'Test Value',
  };

  it('renders header with label and value', () => {
    renderWithAllProviders(<HistoryHeader {...defaultProps} />);

    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders header element with correct classes', () => {
    renderWithAllProviders(<HistoryHeader {...defaultProps} />);

    const headerElement = screen.getByText('Test Label:');
    expect(headerElement).toHaveClass('grade-history-header');
    expect(headerElement).toHaveClass('grade-history-test-id');
  });

  it('renders with string value', () => {
    const props = {
      ...defaultProps,
      value: 'String Value',
    };

    renderWithAllProviders(<HistoryHeader {...props} />);
    expect(screen.getByText('String Value')).toBeInTheDocument();
  });

  it('renders with number value', () => {
    const props = {
      ...defaultProps,
      value: 85,
    };

    renderWithAllProviders(<HistoryHeader {...props} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('renders with null value (default prop)', () => {
    const props = {
      id: 'test-id',
      label: 'Test Label',
    };

    renderWithAllProviders(<HistoryHeader {...props} />);
    expect(screen.getByText('Test Label:')).toBeInTheDocument();

    const valueDiv = screen.getByText('Test Label:').nextSibling;
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toBeEmptyDOMElement();
  });

  it('renders with React node as label', () => {
    const props = {
      ...defaultProps,
      label: <strong>Bold Label</strong>,
    };

    renderWithAllProviders(<HistoryHeader {...props} />);
    const strongElement = screen.getByText('Bold Label');
    expect(strongElement.tagName).toBe('STRONG');
  });

  it('generates correct class name based on id', () => {
    const props = {
      ...defaultProps,
      id: 'assignment-name',
    };

    renderWithAllProviders(<HistoryHeader {...props} />);
    const headerElement = screen.getByText('Test Label:');
    expect(headerElement).toHaveClass('grade-history-assignment-name');
  });

  it('renders container structure correctly', () => {
    renderWithAllProviders(<HistoryHeader {...defaultProps} />);

    const headerElement = screen.getByText('Test Label:');
    const valueElement = screen.getByText('Test Value');

    expect(headerElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();

    expect(headerElement).toHaveClass(
      'grade-history-header',
      'grade-history-test-id',
    );
  });
});
