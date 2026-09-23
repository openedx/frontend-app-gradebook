import { CurrentAppProvider } from '@openedx/frontend-base';
import { appId } from './constants';
import { CourseIdContext } from '@src/data/courseIdContext';
import { FiltersProvider } from '@src/data/filtersContext';
import { GradebookUiProvider } from '@src/data/gradebookUiContext';
import GradebookPage from '@src/containers/GradebookPage';
import './style.scss';

const Gradebook = ({ courseId }: { courseId: string }) => (
  <CurrentAppProvider appId={appId}>
    <CourseIdContext.Provider value={courseId}>
      <FiltersProvider>
        <GradebookUiProvider>
          <GradebookPage />
        </GradebookUiProvider>
      </FiltersProvider>
    </CourseIdContext.Provider>
  </CurrentAppProvider>
);

export default Gradebook;
