
import lms from '@src/data/services/lms';
import { renderWithAllProviders } from '@src/testUtils';
import { screen } from '@testing-library/react';
import ResultsSummary from './ResultsSummary';

jest.mock('@src/data/services/lms', () => ({
  urls: {
    bulkGradesUrlByRow: jest.fn((rowId) => (`www.edx.org/${rowId}`)),
  },
}));

describe('ResultsSummary component', () => {
  const props = {
    rowId: 42,
    text: 'texty',
  };
  let link;
  beforeEach(() => {
    renderWithAllProviders(<ResultsSummary {...props} />);
    link = screen.getByRole('link', { name: props.text });
  });
  test('Hyperlink has target="_blank" and rel="noopener noreferrer"', () => {
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  test('Hyperlink has href to bulkGradesUrl', () => {
    expect(link).toHaveAttribute('href', lms.urls.bulkGradesUrlByRow(props.rowId));
  });
  test('displays Download Icon and text', () => {
    expect(link).toHaveTextContent(props.text);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});
