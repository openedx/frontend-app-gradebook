
import { CurrentAppProvider, PageWrap, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { appId } from './constants';

import queryClient from 'data/queryClient';
import { FiltersProvider } from 'data/filtersContext';
import { GradebookUiProvider } from 'data/gradebookUiContext';
import GradebookPage from 'containers/GradebookPage';
import messages from './messages';

const Main = () => {
  const { formatMessage } = useIntl();
  <CurrentAppProvider appId={appId}>
    <Helmet>
        <title>
          {formatMessage(messages['gradebook.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
    <QueryClientProvider client={queryClient}>
      <FiltersProvider>
        <GradebookUiProvider>
          <PageWrap>
            <GradebookPage />
          </PageWrap>
        </GradebookUiProvider>
      </FiltersProvider>
    </QueryClientProvider>
  </CurrentAppProvider>
};

export default Main;
