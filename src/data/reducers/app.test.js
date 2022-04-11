import appActions from 'data/actions/app';
import filterActions from 'data/actions/filters';
import gradesActions from 'data/actions/grades';
import { formatDateForDisplay } from 'data/actions/utils';
import app, { initialState } from './app';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

const filters = {
  assignmentGradeMax: 'This is',
  assignmentGradeMin: 'the song',
  courseGradeMax: 'that never',
  courseGradeMin: 'eeeeeends',
};
const limitedFilters = {
  assignmentGradeMax: 'It just goes',
  courseGradeMax: 'on and on',
  courseGradeMin: 'my frieeeeend',
};

describe('app reducer', () => {
  it('has initial state', () => {
    expect(app(undefined, {})).toEqual(initialState);
  });

  const testValue = 'roll for initiative';
  describe('handling actions', () => {
    describe('appActions.closeModal', () => {
      it('reloads the modalState from initialState', () => {
        expect(app(
          { ...testingState, modalState: 'arbitrary Override' },
          appActions.closeModal(),
        )).toEqual(testingState);
      });
    });
    describe('appActions.setCourseId', () => {
      it('loads the courseId from the payload', () => {
        expect(
          app(testingState, appActions.setCourseId(testValue)),
        ).toEqual({ ...testingState, courseId: testValue });
      });
    });
    describe('appActions.filterMenu.startTransition', () => {
      it('sets filterMenu.transitioning to true', () => {
        expect(
          app(testingState, appActions.filterMenu.startTransition()),
        ).toEqual({
          ...testingState,
          filterMenu: { ...testingState.filterMenu, transitioning: true },
        });
      });
    });
    describe('appActions.filterMenu.endTransition', () => {
      it('sets filterMenu.transitioning to false', () => {
        const transitioningState = {
          ...testingState,
          filterMenu: { ...testingState.filterMenu, transitioning: true },
        };
        expect(
          app(transitioningState, appActions.filterMenu.endTransition()),
        ).toEqual(testingState);
      });
    });
    describe('appActions.filterMenu.toggle', () => {
      it('toggles filterMenu.open', () => {
        const openState = {
          ...testingState,
          filterMenu: { ...testingState.filterMenu, open: true },
        };
        expect(app(testingState, appActions.filterMenu.toggle())).toEqual(openState);
        expect(app(openState, appActions.filterMenu.toggle())).toEqual(testingState);
      });
    });
    describe('appActions.setLocalFilter', () => {
      it('loads filter values from the payload', () => {
        expect(
          app(testingState, appActions.setLocalFilter(filters)),
        ).toEqual({ ...testingState, filters });

        expect(
          app(testingState, appActions.setLocalFilter(limitedFilters)),
        ).toEqual({
          ...testingState,
          filters: { ...testingState.filters, ...limitedFilters },
        });
      });
    });
    describe('appActions.setModalState', () => {
      it('loads modalState fields from payload', () => {
        const modalState = {
          open: 'Some',
          adjustedGradePossible: 'people',
          adjustedGradeValue: 'staaaarted',
          assignmentName: 'singing',
          reasonForChange: 'it',
          todaysDate: 'not knowing',
          updateModuleId: 'what',
          updateUserId: 'it',
          updateUserName: 'was',
        };
        const limitedFields = {
          adjustedGradePossible: "And they'll continue singin",
          reasonForChange: 'it',
          todaysDate: 'forever',
          updateUserId: 'just because',
        };
        expect(
          app(testingState, appActions.setModalState(modalState)),
        ).toEqual({ ...testingState, modalState });
        expect(
          app(testingState, appActions.setModalState(limitedFields)),
        ).toEqual({
          ...testingState,
          modalState: { ...testingState.modalState, ...limitedFields },
        });
      });
    });
    describe('appActions.setModalStateFromTable', () => {
      const subsection = {
        subsection_name: 'Pi',
        score_possible: 'ka',
        attempted: true,
      };
      const userEntry = {
        user_id: 'Bulba',
        username: 'saur',
      };
      const mockDate = new Date(8675309);
      let dateSpy;
      beforeEach(() => {
        dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      });
      afterEach(() => {
        dateSpy.mockRestore();
      });
      const loadBasicPayload = () => (
        app(testingState, appActions.setModalStateFromTable({ subsection, userEntry }))
      ).modalState;
      it('sets open=true, [reasonForChange,adjustedGradeValue]="", todaysDate=now', () => {
        const modalState = loadBasicPayload();
        expect(modalState.open).toEqual(true);
        expect(modalState.adjustedGradeValue).toEqual('');
        expect(modalState.reasonForChange).toEqual('');
        expect(modalState.todaysDate).toEqual(formatDateForDisplay(mockDate));
      });
      it('clears adjustedGradePossible if not attempted', () => {
        const { modalState } = app(
          testingState,
          appActions.setModalStateFromTable({
            subsection: { ...subsection, attempted: false },
            userEntry,
          }),
        );
        expect(modalState.adjustedGradePossible).toEqual('');
      });
      it('loads score_possible as adjustedGradePossible if subsection.attempted', () => {
        const modalState = loadBasicPayload();
        expect(modalState.adjustedGradePossible).toEqual(subsection.score_possible);
      });
      it('loads subsection name as assignmentName', () => {
        const modalState = loadBasicPayload();
        expect(modalState.assignmentName).toEqual(subsection.subsection_name);
      });
      it('loads module_id, user_id, username', () => {
        const modalState = loadBasicPayload();
        expect(modalState.updateModuleId).toEqual(subsection.module_id);
        expect(modalState.updateUserId).toEqual(userEntry.user_id);
        expect(modalState.updateUserName).toEqual(userEntry.username);
      });
    });
    describe('appActions.setSearchValue', () => {
      it('loads searchValue from payload', () => {
        expect(
          app(testingState, appActions.setSearchValue(testValue)),
        ).toEqual({ ...testingState, searchValue: testValue });
      });
    });
    describe('appActions.setShowImportSuccessToast', () => {
      it('loads showImportSuccessToast from payload', () => {
        expect(
          app(testingState, appActions.setShowImportSuccessToast(testValue)),
        ).toEqual({ ...testingState, showImportSuccessToast: testValue });
      });
    });
    describe('appActions.setView', () => {
      it('loads activeView from payload', () => {
        expect(
          app(testingState, appActions.setView(testValue)),
        ).toEqual({ ...testingState, activeView: testValue });
      });
    });
    describe('filterActions.initialize', () => {
      it('loads relevant filter values', () => {
        expect(
          app(testingState, filterActions.initialize(filters)),
        ).toEqual({ ...testingState, filters });
      });
      it('loads only relevantFilter values', () => {
        expect(
          app(testingState, filterActions.initialize({ never: 'gonna give you up' })),
        ).toEqual(testingState);
      });
    });
    describe('filterActions.reset', () => {
      it('resets all listed filter values to initialFilters value', () => {
        const state = { ...testingState, filters };
        expect(app(
          state,
          filterActions.reset(['assignmentGradeMin', 'courseGradeMax']),
        )).toEqual({
          ...state,
          filters: {
            ...state.filters,
            assignmentGradeMin: initialState.filters.assignmentGradeMin,
            courseGradeMax: initialState.filters.courseGradeMax,
          },
        });
        expect(app(
          state,
          filterActions.reset(['assignmentGradeMax', 'courseGradeMin']),
        )).toEqual({
          ...state,
          filters: {
            ...state.filters,
            assignmentGradeMax: initialState.filters.assignmentGradeMax,
            courseGradeMin: initialState.filters.courseGradeMin,
          },
        });
      });
    });
    describe('grade actions csvUpload.finished', () => {
      it('sets showImportSuccessToast to true', () => {
        expect(
          app(testingState, gradesActions.csvUpload.finished()),
        ).toEqual({ ...testingState, showImportSuccessToast: true });
      });
    });
  });
});
