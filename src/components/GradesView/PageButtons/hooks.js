import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux/hooks';
import messages from './messages';

export const usePageButtonsData = () => {
  const { formatMessage } = useIntl();

  const { nextPage, prevPage } = selectors.grades.useGradeData();
  const getPrevNextGrades = thunkActions.grades.useFetchPrevNextGrades();

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
