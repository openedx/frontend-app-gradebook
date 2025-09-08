import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';
import userEvent from '@testing-library/user-event';

import { instructorDashboardUrl } from 'data/services/lms/urls';

import { GradebookHeader } from './index';
import useGradebookHeaderData from './hooks';
import messages from './messages';

jest.mock('data/services/lms/urls', () => ({
  instructorDashboardUrl: jest.fn(),
}));
jest.mock('./hooks', () => jest.fn());

initializeMocks();

describe('GradebookHeader', () => {
  const mockHandleToggleViewClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    instructorDashboardUrl.mockReturnValue('https://example.com/dashboard');
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      useGradebookHeaderData.mockReturnValue({
        areGradesFrozen: false,
        canUserViewGradebook: true,
        courseId: 'course-v1:TestU+CS101+2024',
        handleToggleViewClick: mockHandleToggleViewClick,
        showBulkManagement: false,
        toggleViewMessage: messages.toActivityLog,
      });
    });

    it('renders the main header container', () => {
      render(<GradebookHeader />);
      const header = screen.getByText('Gradebook').closest('.gradebook-header');
      expect(header).toHaveClass('gradebook-header');
    });

    it('renders back to dashboard link', () => {
      render(<GradebookHeader />);
      const dashboardLink = screen.getByRole('link');
      expect(dashboardLink).toHaveAttribute(
        'href',
        'https://example.com/dashboard',
      );
      expect(dashboardLink).toHaveClass('mb-3');
      expect(dashboardLink).toHaveTextContent('Back to Dashboard');
    });

    it('renders gradebook title', () => {
      render(<GradebookHeader />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Gradebook');
    });

    it('renders course ID subtitle', () => {
      render(<GradebookHeader />);
      const subtitle = screen.getByRole('heading', { level: 2 });
      expect(subtitle).toHaveTextContent('course-v1:TestU+CS101+2024');
      expect(subtitle).toHaveClass('text-break');
    });

    it('renders subtitle row with correct classes', () => {
      render(<GradebookHeader />);
      const subtitleRow = screen.getByRole('heading', {
        level: 2,
      }).parentElement;
      expect(subtitleRow).toHaveClass(
        'subtitle-row',
        'd-flex',
        'justify-content-between',
        'align-items-center',
      );
    });

    it('calls instructorDashboardUrl to get dashboard URL', () => {
      render(<GradebookHeader />);
      expect(instructorDashboardUrl).toHaveBeenCalled();
    });

    it('calls useGradebookHeaderData hook', () => {
      render(<GradebookHeader />);
      expect(useGradebookHeaderData).toHaveBeenCalled();
    });
  });

  describe('bulk management toggle button', () => {
    describe('when showBulkManagement is true', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: true,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('renders toggle view button', () => {
        render(<GradebookHeader />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('displays correct button text from toggleViewMessage', () => {
        render(<GradebookHeader />);
        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveTextContent('View Bulk Management History');
      });

      it('calls handleToggleViewClick when button is clicked', async () => {
        render(<GradebookHeader />);
        const user = userEvent.setup();
        const toggleButton = screen.getByRole('button');

        await user.click(toggleButton);
        expect(mockHandleToggleViewClick).toHaveBeenCalledTimes(1);
      });

      it('displays correct message from toggleViewMessage', () => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: true,
          toggleViewMessage: messages.toGradesView,
        });

        render(<GradebookHeader />);
        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveTextContent('Return to Gradebook');
      });
    });

    describe('when showBulkManagement is false', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: false,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('does not render toggle view button', () => {
        render(<GradebookHeader />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });
    });
  });

  describe('frozen grades warning', () => {
    describe('when areGradesFrozen is true', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: true,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: false,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('renders frozen warning alert', () => {
        render(<GradebookHeader />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('alert', 'alert-warning');
        expect(alert).toHaveTextContent(
          'The grades for this course are now frozen. Editing of grades is no longer allowed.',
        );
      });
    });

    describe('when areGradesFrozen is false', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: false,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('does not render frozen warning alert', () => {
        render(<GradebookHeader />);
        expect(
          screen.queryByText(
            'The grades for this course are now frozen. Editing of grades is no longer allowed.',
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('unauthorized warning', () => {
    describe('when canUserViewGradebook is false', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: false,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: false,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('renders unauthorized warning alert', () => {
        render(<GradebookHeader />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('alert', 'alert-warning');
        expect(alert).toHaveTextContent(
          'You are not authorized to view the gradebook for this course.',
        );
      });
    });

    describe('when canUserViewGradebook is true', () => {
      beforeEach(() => {
        useGradebookHeaderData.mockReturnValue({
          areGradesFrozen: false,
          canUserViewGradebook: true,
          courseId: 'course-v1:TestU+CS101+2024',
          handleToggleViewClick: mockHandleToggleViewClick,
          showBulkManagement: false,
          toggleViewMessage: messages.toActivityLog,
        });
      });

      it('does not render unauthorized warning alert', () => {
        render(<GradebookHeader />);
        expect(
          screen.queryByText(
            'You are not authorized to view the gradebook for this course.',
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('multiple warnings', () => {
    it('renders both frozen and unauthorized warnings when both conditions are true', () => {
      useGradebookHeaderData.mockReturnValue({
        areGradesFrozen: true,
        canUserViewGradebook: false,
        courseId: 'course-v1:TestU+CS101+2024',
        handleToggleViewClick: mockHandleToggleViewClick,
        showBulkManagement: false,
        toggleViewMessage: messages.toActivityLog,
      });

      render(<GradebookHeader />);
      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);

      expect(
        screen.getByText(
          'The grades for this course are now frozen. Editing of grades is no longer allowed.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'You are not authorized to view the gradebook for this course.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('complete integration', () => {
    it('renders all elements when showBulkManagement is true', () => {
      useGradebookHeaderData.mockReturnValue({
        areGradesFrozen: false,
        canUserViewGradebook: true,
        courseId: 'course-v1:TestU+CS101+2024',
        handleToggleViewClick: mockHandleToggleViewClick,
        showBulkManagement: true,
        toggleViewMessage: messages.toActivityLog,
      });

      render(<GradebookHeader />);

      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
