
import lms from '@src/data/services/lms';
import { renderWithAllProviders } from '@src/testUtils';
import { screen } from '@testing-library/react';
import ResultsSummary from './ResultsSummary';

jest.mock('@src/data/services/lms', () => ({
  urls: {
    bulkGradesUrlByRow: jest.fn((courseId, rowId) => (`www.edx.org/${courseId}/${rowId}`)),
  },
}));

describe('ResultsSummary component', () => {
  const props = {
    rowId: 42,
    text: 'texty',
  };
  // renderWithAllProviders mounts under /gradebook/testCourseId; testCourseId
  // is `course-v1:edX+DemoX+Demo` (see src/testUtils.tsx).
  const routedCourseId = 'course-v1:edX+DemoX+Demo';
  let link;
  beforeEach(() => {
    renderWithAllProviders(<ResultsSummary {...props} />);
    link = screen.getByRole('link', { name: props.text });
  });
  test('Hyperlink has target="_blank" and rel="noopener noreferrer"', () => {
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  test('Hyperlink has href to bulkGradesUrl with the routed courseId and rowId', () => {
    expect(link).toHaveAttribute('href', lms.urls.bulkGradesUrlByRow(routedCourseId, props.rowId));
  });
  test('displays Download Icon and text', () => {
    expect(link).toHaveTextContent(props.text);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});
