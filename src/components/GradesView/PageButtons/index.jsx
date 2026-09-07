import React from 'react';

import { Button } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useFetchPrevNextGrades, useGradeData } from '../data/hooks';
import messages from './messages';

export const PageButtons = () => {
  const { formatMessage } = useIntl();
  const { nextPage, prevPage } = useGradeData();
  const getPrevNextGrades = useFetchPrevNextGrades();

  return (
    <div
      className="d-flex justify-content-center"
      style={{ paddingBottom: '20px' }}
    >
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={!prevPage}
        onClick={() => getPrevNextGrades(prevPage)}
      >
        {formatMessage(messages.prevPage)}
      </Button>
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={!nextPage}
        onClick={() => getPrevNextGrades(nextPage)}
      >
        {formatMessage(messages.nextPage)}
      </Button>
    </div>
  );
};

PageButtons.propTypes = {};

export default PageButtons;
