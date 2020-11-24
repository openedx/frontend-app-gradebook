import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import SiteFooter, { messages as footerMessages } from '@edx/frontend-component-footer';
import {
  APP_READY,
  getConfig,
  initialize,
  subscribe,
} from '@edx/frontend-platform';
import { IntlProvider } from 'react-intl';

import {
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faRedditSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GradebookPage from './containers/GradebookPage';
import Header from './components/Header';
import store from './data/store';
import FooterLogo from '../assets/edx-footer.png';
import './App.scss';

const socialLinks = [
  {
    title: 'Facebook',
    url: process.env.FACEBOOK_URL,
    icon: <FontAwesomeIcon icon={faFacebookSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Like edX on Facebook',
  },
  {
    title: 'Twitter',
    url: process.env.TWITTER_URL,
    icon: <FontAwesomeIcon icon={faTwitterSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on Twitter',
  },
  {
    title: 'LinkedIn',
    url: process.env.LINKED_IN_URL,
    icon: <FontAwesomeIcon icon={faLinkedin} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on LinkedIn',
  },
  {
    title: 'Reddit',
    url: process.env.REDDIT_URL,
    icon: <FontAwesomeIcon icon={faRedditSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Subscribe to the edX subreddit',
  },
];

const App = () => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <Router>
        <div>
          <Header />
          <main>
            <Switch>
              <Route exact path={getConfig().PUBLIC_PATH.concat(':courseId')} component={GradebookPage} />
            </Switch>
          </main>
          <SiteFooter
            siteName={process.env.SITE_NAME}
            siteLogo={FooterLogo}
            marketingSiteBaseUrl={process.env.MARKETING_SITE_BASE_URL}
            supportUrl={process.env.SUPPORT_URL}
            contactUrl={process.env.CONTACT_URL}
            openSourceUrl={process.env.OPEN_SOURCE_URL}
            termsOfServiceUrl={process.env.TERMS_OF_SERVICE_URL}
            privacyPolicyUrl={process.env.PRIVACY_POLICY_URL}
            appleAppStoreUrl={process.env.APPLE_APP_STORE_URL}
            googlePlayUrl={process.env.GOOGLE_PLAY_URL}
            socialLinks={socialLinks}
            enterpriseMarketingLink={{
              url: process.env.ENTERPRISE_MARKETING_URL,
              queryParams: {
                utm_source: process.env.ENTERPRISE_MARKETING_UTM_SOURCE,
                utm_campaign: process.env.ENTERPRISE_MARKETING_UTM_CAMPAIGN,
                utm_medium: process.env.ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM,
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  </IntlProvider>
);

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  messages: [
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
