import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@edx/frontend-platform/react';
import { FooterSlot } from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';
import queryClient from 'data/queryClient';
import { FiltersProvider } from 'data/filtersContext';
import { GradebookUiProvider } from 'data/gradebookUiContext';
import GradebookPage from 'containers/GradebookPage';
import './App.scss';
import Head from './head/Head';

const App = () => (
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <FiltersProvider>
        <GradebookUiProvider>
          <Head />
          <div>
            <Header />
            <main>
              <Routes>
                <Route
                  path="/:courseId"
                  element={<GradebookPage />}
                />
              </Routes>
            </main>
            <FooterSlot />
          </div>
        </GradebookUiProvider>
      </FiltersProvider>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
