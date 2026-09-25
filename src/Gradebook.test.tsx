import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useCourseId as mockUseCourseId } from '@src/data/courseIdContext';
import { useGradebookNavigation as mockUseGradebookNavigation } from '@src/data/gradebookNavigationContext';

import Gradebook from './Gradebook';

// Replace the mounted page with a probe that surfaces the contexts Gradebook publishes.
// Imports are aliased with a `mock` prefix so `babel-plugin-jest-hoist` lets the
// factory reference them (jest.mock is hoisted above imports).
jest.mock('@src/containers/GradebookPage', () => {
  const GradebookPageProbe = () => {
    const courseId = mockUseCourseId();
    const { onBack } = mockUseGradebookNavigation();
    return (
      <div>
        <span data-testid="course-id">{courseId}</span>
        {onBack && (
          <button type="button" onClick={onBack} data-testid="probe-back">back</button>
        )}
      </div>
    );
  };
  return GradebookPageProbe;
});

const renderInRouter = (ui: React.ReactElement) => render(
  <MemoryRouter>{ui}</MemoryRouter>,
);

describe('Gradebook', () => {
  it('publishes courseId on CourseIdContext', () => {
    renderInRouter(<Gradebook courseId="course-v1:TestU+CS101+2024" />);
    expect(screen.getByTestId('course-id')).toHaveTextContent('course-v1:TestU+CS101+2024');
  });

  it('publishes onBack on GradebookNavigationContext when supplied', async () => {
    const onBack = jest.fn();
    renderInRouter(<Gradebook courseId="course-v1:X" onBack={onBack} />);
    await userEvent.click(screen.getByTestId('probe-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('leaves onBack undefined on the navigation context when omitted', () => {
    renderInRouter(<Gradebook courseId="course-v1:X" />);
    expect(screen.queryByTestId('probe-back')).not.toBeInTheDocument();
  });
});
