import { CurrentAppProvider } from '@openedx/frontend-base';
import { appId } from './constants';
import { CourseIdContext } from '@src/data/courseIdContext';
import { FiltersProvider } from '@src/data/filtersContext';
import { GradebookUiProvider } from '@src/data/gradebookUiContext';
import { GradebookNavigationContext } from '@src/data/gradebookNavigationContext';
import GradebookPage from '@src/containers/GradebookPage';
import './style.scss';

interface GradebookProps {
  courseId: string,
  onBack?: () => void,
}

const Gradebook = ({ courseId, onBack }: GradebookProps) => (
  <CurrentAppProvider appId={appId}>
    <CourseIdContext.Provider value={courseId}>
      <GradebookNavigationContext.Provider value={{ onBack }}>
        <FiltersProvider>
          <GradebookUiProvider>
            <GradebookPage />
          </GradebookUiProvider>
        </FiltersProvider>
      </GradebookNavigationContext.Provider>
    </CourseIdContext.Provider>
  </CurrentAppProvider>
);

export default Gradebook;
