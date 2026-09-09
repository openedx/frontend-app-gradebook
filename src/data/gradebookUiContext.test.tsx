import { act, renderHook } from '@testing-library/react';

import { GradebookUiProvider, useGradebookUi } from './gradebookUiContext';

jest.mock('@src/data/formatUtils', () => ({
  ...jest.requireActual('@src/data/formatUtils'),
  formatDateForDisplay: () => '2024-01-01',
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GradebookUiProvider>{children}</GradebookUiProvider>
);

const setup = () => renderHook(() => useGradebookUi(), { wrapper });

describe('GradebookUiProvider / useGradebookUi', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // rAF isn't advanced by jest fake timers; polyfill to run synchronously.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('throws when used outside a GradebookUiProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useGradebookUi())).toThrow(
      /must be used within a GradebookUiProvider/,
    );
    spy.mockRestore();
  });

  it('seeds the expected initial state', () => {
    const { result } = setup();
    expect(result.current).toMatchObject({
      gradeFormat: 'percent',
      showSuccess: false,
      showImportSuccessToast: false,
      filterMenuOpen: false,
      filterMenuTransitioning: false,
      gradesPageEndpoint: null,
      csvUploadSuccess: false,
      csvUploadErrorMessages: [],
      modalState: { open: false, updateModuleId: null, updateUserId: null },
    });
  });

  it('simple setters update their fields', () => {
    const { result } = setup();
    act(() => {
      result.current.setGradeFormat('absolute');
      result.current.setShowSuccess(true);
      result.current.setShowImportSuccessToast(true);
      result.current.setActiveView('bulkManagementHistory');
      result.current.setGradesPageEndpoint('https://lms/next');
    });
    expect(result.current).toMatchObject({
      gradeFormat: 'absolute',
      showSuccess: true,
      showImportSuccessToast: true,
      activeView: 'bulkManagementHistory',
      gradesPageEndpoint: 'https://lms/next',
    });
  });

  describe('filter menu', () => {
    it('toggleFilterMenu flips filterMenuOpen after the rAF/setTimeout tick', () => {
      const { result } = setup();
      act(() => {
        result.current.toggleFilterMenu();
      });
      expect(result.current.filterMenuTransitioning).toBe(true);
      act(() => {
        jest.runAllTimers();
      });
      expect(result.current.filterMenuOpen).toBe(true);
    });

    it('closeFilterMenu is a no-op when the menu is already closed', () => {
      const { result } = setup();
      act(() => {
        result.current.closeFilterMenu();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(result.current.filterMenuOpen).toBe(false);
    });

    it('closeFilterMenu toggles when the menu is open', () => {
      const { result } = setup();
      act(() => {
        result.current.toggleFilterMenu();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(result.current.filterMenuOpen).toBe(true);
      act(() => {
        result.current.closeFilterMenu();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(result.current.filterMenuOpen).toBe(false);
    });

    it('handleFilterMenuTransitionEnd resets transitioning only when target === currentTarget', () => {
      const { result } = setup();
      act(() => {
        result.current.toggleFilterMenu();
      });
      const el = {} as unknown as EventTarget;
      // Bubbling child event — ignored.
      act(() => {
        result.current.handleFilterMenuTransitionEnd({
          currentTarget: el, target: {} as EventTarget,
        } as unknown as React.TransitionEvent);
      });
      expect(result.current.filterMenuTransitioning).toBe(true);
      // Self event — resets.
      act(() => {
        result.current.handleFilterMenuTransitionEnd({
          currentTarget: el, target: el,
        } as unknown as React.TransitionEvent);
      });
      expect(result.current.filterMenuTransitioning).toBe(false);
    });
  });

  describe('modal state', () => {
    it('setModalState merges only allowed fields', () => {
      const { result } = setup();
      act(() => {
        result.current.setModalState({
          open: true,
          reasonForChange: 'late',
          adjustedGradeValue: '9',
          // Unknown field — dropped.
          ...({ unknown: 'x' } as unknown as Record<string, unknown>),
        } as never);
      });
      expect(result.current.modalState).toMatchObject({
        open: true,
        reasonForChange: 'late',
        adjustedGradeValue: '9',
      });
      expect(result.current.modalState).not.toHaveProperty('unknown');
    });

    it('setModalStateFromTable opens the modal seeded from the clicked cell', () => {
      const { result } = setup();
      act(() => {
        result.current.setModalStateFromTable({
          subsection: {
            attempted: true, score_possible: 10, subsection_name: 'Week 1', module_id: 'a1',
          },
          userEntry: { user_id: 3, username: 'abc' },
        });
      });
      expect(result.current.modalState).toMatchObject({
        open: true,
        adjustedGradePossible: 10,
        assignmentName: 'Week 1',
        updateModuleId: 'a1',
        updateUserId: 3,
        updateUserName: 'abc',
        todaysDate: '2024-01-01',
      });
    });

    it('setModalStateFromTable leaves adjustedGradePossible empty when not attempted', () => {
      const { result } = setup();
      act(() => {
        result.current.setModalStateFromTable({
          subsection: { attempted: false, subsection_name: 'x', module_id: 'a1' },
          userEntry: { user_id: 3, username: 'abc' },
        });
      });
      expect(result.current.modalState.adjustedGradePossible).toBe('');
    });

    it('closeModal resets the modal to the initial state', () => {
      const { result } = setup();
      act(() => {
        result.current.setModalStateFromTable({
          subsection: { attempted: true, score_possible: 5, subsection_name: 's', module_id: 'a1' },
          userEntry: { user_id: 3, username: 'abc' },
        });
      });
      act(() => {
        result.current.closeModal();
      });
      expect(result.current.modalState).toMatchObject({
        open: false,
        updateModuleId: null,
        updateUserId: null,
      });
    });
  });

  describe('CSV upload feedback', () => {
    it('markCsvUploadSuccess sets success=true and clears errors', () => {
      const { result } = setup();
      act(() => {
        result.current.setCsvUploadErrors(['e1']);
      });
      act(() => {
        result.current.markCsvUploadSuccess();
      });
      expect(result.current.csvUploadSuccess).toBe(true);
      expect(result.current.csvUploadErrorMessages).toEqual([]);
    });

    it('setCsvUploadErrors sets messages and clears success', () => {
      const { result } = setup();
      act(() => {
        result.current.markCsvUploadSuccess();
      });
      act(() => {
        result.current.setCsvUploadErrors(['e1', 'e2']);
      });
      expect(result.current.csvUploadSuccess).toBe(false);
      expect(result.current.csvUploadErrorMessages).toEqual(['e1', 'e2']);
    });

    it('resetCsvUpload clears both success and errors', () => {
      const { result } = setup();
      act(() => {
        result.current.setCsvUploadErrors(['e1']);
      });
      act(() => {
        result.current.resetCsvUpload();
      });
      expect(result.current.csvUploadSuccess).toBe(false);
      expect(result.current.csvUploadErrorMessages).toEqual([]);
    });
  });
});
