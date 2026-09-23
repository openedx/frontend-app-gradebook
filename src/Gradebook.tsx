import { CurrentAppProvider } from '@openedx/frontend-base';
import { appId } from './constants';
import { FiltersProvider } from '@src/data/filtersContext';
import { GradebookUiProvider } from '@src/data/gradebookUiContext';
import GradebookPage from '@src/containers/GradebookPage';
import './style.scss';

const Gradebook = () => (
  <CurrentAppProvider appId={appId}>
    <FiltersProvider>
      <GradebookUiProvider>
        <GradebookPage />
      </GradebookUiProvider>
    </FiltersProvider>
  </CurrentAppProvider>
);

export default Gradebook;
