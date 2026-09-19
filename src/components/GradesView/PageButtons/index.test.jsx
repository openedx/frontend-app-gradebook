import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useFetchPrevNextGrades, useGradeData } from '../data/hooks';
import PageButtons from '.';
import messages from './messages';

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useFetchPrevNextGrades: jest.fn(),
  useGradeData: jest.fn(),
}));

const prevText = messages.prevPage.defaultMessage;
const nextText = messages.nextPage.defaultMessage;

const setup = ({ prevPage = null, nextPage = null } = {}) => {
  const getPrevNext = jest.fn();
  useGradeData.mockReturnValue({ prevPage, nextPage });
  useFetchPrevNextGrades.mockReturnValue(getPrevNext);
  renderWithAllProviders(<PageButtons />);
  return { getPrevNext };
};

describe('PageButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the prev and next buttons', () => {
    setup();
    expect(screen.getByRole('button', { name: prevText })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: nextText })).toBeInTheDocument();
  });

  it('disables prev when there is no prevPage cursor', () => {
    setup({ prevPage: null, nextPage: '/next' });
    expect(screen.getByRole('button', { name: prevText })).toBeDisabled();
    expect(screen.getByRole('button', { name: nextText })).toBeEnabled();
  });

  it('disables next when there is no nextPage cursor', () => {
    setup({ prevPage: '/prev', nextPage: null });
    expect(screen.getByRole('button', { name: prevText })).toBeEnabled();
    expect(screen.getByRole('button', { name: nextText })).toBeDisabled();
  });

  it('fetches the previous page when the prev button is clicked', async () => {
    const { getPrevNext } = setup({ prevPage: '/prev', nextPage: '/next' });
    await userEvent.click(screen.getByRole('button', { name: prevText }));
    expect(getPrevNext).toHaveBeenCalledWith('/prev');
  });

  it('fetches the next page when the next button is clicked', async () => {
    const { getPrevNext } = setup({ prevPage: '/prev', nextPage: '/next' });
    await userEvent.click(screen.getByRole('button', { name: nextText }));
    expect(getPrevNext).toHaveBeenCalledWith('/next');
  });
});
