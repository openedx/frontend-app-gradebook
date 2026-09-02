import { useIntl } from '@edx/frontend-platform/i18n';

import { useFetchPrevNextGrades, useGradeData } from '../data/hooks';
import messages from './messages';

export const usePageButtonsData = () => {
  const { formatMessage } = useIntl();

  const { nextPage, prevPage } = useGradeData();
  const getPrevNextGrades = useFetchPrevNextGrades();

  const getPrevGrades = () => {
    getPrevNextGrades(prevPage);
  };

  const getNextGrades = () => {
    getPrevNextGrades(nextPage);
  };

  return {
    prev: {
      disabled: !prevPage,
      onClick: getPrevGrades,
      text: formatMessage(messages.prevPage),
    },
    next: {
      disabled: !nextPage,
      onClick: getNextGrades,
      text: formatMessage(messages.nextPage),
    },
  };
};

export default usePageButtonsData;
