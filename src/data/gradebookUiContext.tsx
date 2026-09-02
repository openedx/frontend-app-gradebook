import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';

import { views, modalFieldKeys } from 'data/constants/app';
import { formatDateForDisplay } from 'data/formatUtils';

/** Edit-grade modal state (was the Redux `app.modalState` slice). */
export interface ModalState {
  open: boolean;
  adjustedGradePossible: string | number;
  adjustedGradeValue: string | number;
  assignmentName: string;
  reasonForChange: string;
  todaysDate: string;
  updateModuleId: string | null;
  updateUserId: number | null;
  updateUserName: string | null;
}

/** Payload for opening the modal from a grade-table cell. */
export interface ModalStateFromTablePayload {
  subsection: {
    attempted?: boolean;
    score_possible?: number;
    subsection_name?: string;
    module_id?: string;
  };
  userEntry: {
    user_id?: number;
    username?: string;
  };
}

// Mirrors the Redux `app` reducer's `initialState.modalState`.
const initialModalState: ModalState = {
  open: false,
  adjustedGradePossible: '',
  adjustedGradeValue: 0,
  assignmentName: '',
  reasonForChange: '',
  todaysDate: '',
  updateModuleId: null,
  updateUserId: null,
  updateUserName: null,
};

/**
 * Client-side gradebook **UI** state, held in React (Context + useState).
 *
 * This is the target home for the non-filter UI bits currently in the Redux `app`
 * and `grades` slices (grade format toggle, success banner, import toast, active
 * view, filter-menu open/transition, modal state). It is being populated one piece
 * at a time; unlike the filter values, these do not feed the grades fetch, so they
 * migrate here with no Redux bridge (they simply stop using Redux).
 */
export interface GradebookUiContextValue {
  /** Grade display format: 'percent' | 'absolute'. */
  gradeFormat: string;
  setGradeFormat: (value: string) => void;
  /** Success banner shown after a grade override is saved. */
  showSuccess: boolean;
  setShowSuccess: (value: boolean) => void;
  /** Toast shown after a successful bulk grade CSV import. */
  showImportSuccessToast: boolean;
  setShowImportSuccessToast: (value: boolean) => void;
  /** Active top-level tab: views.grades | views.bulkManagementHistory. */
  activeView: string;
  setActiveView: (value: string) => void;
  /**
   * Filter sidebar open/close state, with the same two-phase transition the old
   * Redux `app.filterMenu` slice modeled (`open` + `transitioning`). Consumers
   * derive `isClosed`/`isOpening` from these two.
   */
  filterMenuOpen: boolean;
  filterMenuTransitioning: boolean;
  /** Toggle the sidebar (starts the transition, flips `open` on the next frame). */
  toggleFilterMenu: () => void;
  /** Close the sidebar if it is currently open (no-op otherwise). */
  closeFilterMenu: () => void;
  /** onTransitionEnd handler for the sidebar; ends the transition phase. */
  handleFilterMenuTransitionEnd: (event: React.TransitionEvent) => void;
  /** Edit-grade modal state (was Redux `app.modalState`). */
  modalState: ModalState;
  /** Merge a partial update into modalState (filtered to the known modal fields). */
  setModalState: (partial: Partial<ModalState>) => void;
  /** Open the modal seeded from a grade-table cell (subsection + user entry). */
  setModalStateFromTable: (payload: ModalStateFromTablePayload) => void;
  /** Reset the modal to its initial (closed) state. */
  closeModal: () => void;
  /**
   * Current grades pagination cursor: the opaque prev/next URL from the last
   * grades response, or null for the first (unpaged) page. Held here so the
   * `useGrades` query can key/refetch off it; filter changes reset it to null.
   */
  gradesPageEndpoint: string | null;
  setGradesPageEndpoint: (endpoint: string | null) => void;
  /**
   * Bulk grade CSV-upload result feedback shown by `BulkManagementAlerts` (was the
   * Redux `grades.bulkManagement` `uploadSuccess`/`errorMessages`).
   */
  csvUploadSuccess: boolean;
  csvUploadErrorMessages: string[];
  /** Reset the CSV-upload feedback (upload started). */
  resetCsvUpload: () => void;
  /** Mark the CSV upload succeeded. */
  markCsvUploadSuccess: () => void;
  /** Record CSV-upload error messages. */
  setCsvUploadErrors: (messages: string[]) => void;
}

const GradebookUiContext = createContext<GradebookUiContextValue | undefined>(undefined);

interface GradebookUiProviderProps {
  children: React.ReactNode;
}

export const GradebookUiProvider = ({ children }: GradebookUiProviderProps) => {
  const [gradeFormat, setGradeFormat] = useState<string>('percent');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showImportSuccessToast, setShowImportSuccessToast] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>(views.grades);

  // Filter sidebar animation state. This mirrors the old Redux `filterMenu` thunks:
  // `toggle` flips `open` one frame after starting the transition, and the sidebar's
  // onTransitionEnd ends the transition. `close` reads the latest `open` via a ref
  // so it can be a stable callback.
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [filterMenuTransitioning, setFilterMenuTransitioning] = useState<boolean>(false);
  const filterMenuOpenRef = useRef<boolean>(filterMenuOpen);
  useEffect(() => { filterMenuOpenRef.current = filterMenuOpen; }, [filterMenuOpen]);

  const toggleFilterMenu = useCallback(() => {
    setFilterMenuTransitioning(true);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => { setFilterMenuOpen((open) => !open); });
    });
  }, []);

  const closeFilterMenu = useCallback(() => {
    if (filterMenuOpenRef.current) {
      toggleFilterMenu();
    }
  }, [toggleFilterMenu]);

  const handleFilterMenuTransitionEnd = useCallback((event: React.TransitionEvent) => {
    if (event.currentTarget === event.target) {
      setFilterMenuTransitioning(false);
    }
  }, []);

  // Edit-grade modal state. These ops are a faithful port of the Redux `app`
  // reducer cases: `setModalState` merges a field-filtered partial, `closeModal`
  // resets to the initial state, and `setModalStateFromTable` opens the modal
  // seeded from the clicked grade cell.
  const [modalState, setModalStateValue] = useState<ModalState>(initialModalState);

  const setModalState = useCallback((partial: Partial<ModalState>) => {
    const filtered = (Object.keys(modalFieldKeys) as (keyof ModalState)[]).reduce(
      (obj, key) => (partial[key] !== undefined ? { ...obj, [key]: partial[key] } : obj),
      {} as Partial<ModalState>,
    );
    setModalStateValue((prev) => ({ ...prev, ...filtered }));
  }, []);

  const setModalStateFromTable = useCallback(
    ({ subsection, userEntry }: ModalStateFromTablePayload) => {
      setModalStateValue({
        open: true,
        adjustedGradeValue: '',
        reasonForChange: '',
        todaysDate: formatDateForDisplay(new Date()),
        adjustedGradePossible: subsection.attempted ? (subsection.score_possible ?? '') : '',
        assignmentName: `${subsection.subsection_name}`,
        updateModuleId: subsection.module_id ?? null,
        updateUserId: userEntry.user_id ?? null,
        updateUserName: userEntry.username ?? null,
      });
    },
    [],
  );

  const closeModal = useCallback(() => {
    setModalStateValue(initialModalState);
  }, []);

  // Grades pagination cursor (opaque prev/next URL, or null for the first page).
  const [gradesPageEndpoint, setGradesPageEndpoint] = useState<string | null>(null);

  // Bulk CSV-upload result feedback (was Redux `grades.bulkManagement`).
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<boolean>(false);
  const [csvUploadErrorMessages, setCsvUploadErrorMessages] = useState<string[]>([]);
  const resetCsvUpload = useCallback(() => {
    setCsvUploadSuccess(false);
    setCsvUploadErrorMessages([]);
  }, []);
  const markCsvUploadSuccess = useCallback(() => {
    setCsvUploadSuccess(true);
    setCsvUploadErrorMessages([]);
  }, []);
  const setCsvUploadErrors = useCallback((messages: string[]) => {
    setCsvUploadSuccess(false);
    setCsvUploadErrorMessages(messages);
  }, []);

  const value = useMemo<GradebookUiContextValue>(
    () => ({
      gradeFormat,
      setGradeFormat,
      showSuccess,
      setShowSuccess,
      showImportSuccessToast,
      setShowImportSuccessToast,
      activeView,
      setActiveView,
      filterMenuOpen,
      filterMenuTransitioning,
      toggleFilterMenu,
      closeFilterMenu,
      handleFilterMenuTransitionEnd,
      modalState,
      setModalState,
      setModalStateFromTable,
      closeModal,
      gradesPageEndpoint,
      setGradesPageEndpoint,
      csvUploadSuccess,
      csvUploadErrorMessages,
      resetCsvUpload,
      markCsvUploadSuccess,
      setCsvUploadErrors,
    }),
    [
      gradeFormat, showSuccess, showImportSuccessToast, activeView,
      filterMenuOpen, filterMenuTransitioning,
      toggleFilterMenu, closeFilterMenu, handleFilterMenuTransitionEnd,
      modalState, setModalState, setModalStateFromTable, closeModal,
      gradesPageEndpoint,
      csvUploadSuccess, csvUploadErrorMessages,
      resetCsvUpload, markCsvUploadSuccess, setCsvUploadErrors,
    ],
  );

  return (
    <GradebookUiContext.Provider value={value}>
      {children}
    </GradebookUiContext.Provider>
  );
};

/**
 * useGradebookUi()
 * Accessor for the gradebook UI-state context. Throws if used outside a
 * <GradebookUiProvider>.
 */
export const useGradebookUi = (): GradebookUiContextValue => {
  const context = useContext(GradebookUiContext);
  if (context === undefined) {
    throw new Error('useGradebookUi must be used within a GradebookUiProvider');
  }
  return context;
};

export default GradebookUiContext;
