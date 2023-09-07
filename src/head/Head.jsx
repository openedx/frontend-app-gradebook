import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';

const Head = () => {
  console.log("HEAD");

  const { formatMessage } = useIntl();
  console.log("FM");
  return (
    <Helmet>
      <title>
        {formatMessage(messages['gradebook.page.title'], { siteName: getConfig().SITE_NAME })}
      </title>
      <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
    </Helmet>
  );
};

Head.propTypes = {
};

export default Head;
