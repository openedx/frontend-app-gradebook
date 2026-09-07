
import { CurrentAppProvider, PageWrap, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { appId } from './constants';
import { FiltersProvider } from 'data/filtersContext';
import { GradebookUiProvider } from 'data/gradebookUiContext';
import GradebookPage from 'containers/GradebookPage';
import messages from './messages';
import './style.scss';

const Main = () => {
  const { formatMessage } = useIntl();
  return (
    <CurrentAppProvider appId={appId}>
      <Helmet>
        <title>
          {formatMessage(messages['gradebook.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
      <FiltersProvider>
        <GradebookUiProvider>
          <PageWrap>
            <GradebookPage />
          </PageWrap>
        </GradebookUiProvider>
      </FiltersProvider>
  </CurrentAppProvider>
  );
};

export default Main;
