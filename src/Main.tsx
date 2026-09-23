import { PageWrap, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import Gradebook from './Gradebook';
import messages from './messages';

const Main = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Helmet>
        <title>
          {formatMessage(messages['gradebook.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
      <PageWrap>
        <Gradebook />
      </PageWrap>
    </>
  );
};

export default Main;
