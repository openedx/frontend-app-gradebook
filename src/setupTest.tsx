import '@testing-library/jest-dom';
import siteConfig from 'site.config';
import {
  addAppConfigs, configureLogging, mergeSiteConfig, MockLoggingService,
} from '@openedx/frontend-base';

// Seed configuration for tests, since initialize() is not called.
mergeSiteConfig(siteConfig);
addAppConfigs();
// Ensures logError/logInfo don't crash on a null `service` when tests
// don't call initializeMockApp themselves.
configureLogging(MockLoggingService, { config: siteConfig });

class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
}

global.ResizeObserver = ResizeObserver;

// jsdom does not implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();
