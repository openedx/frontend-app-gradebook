import { PageWrap, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Gradebook from './Gradebook';
import messages from './messages';

const Main = () => {
  const { formatMessage } = useIntl();
  const { courseId = '' } = useParams();
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
        <Gradebook courseId={courseId} />
      </PageWrap>
    </>
  );
};

export default Main;
