import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { render, initializeMocks } from 'testUtilsExtra';

import useGradesViewData from './hooks';
import GradesView from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  stepHeadings: {
    filter: 'filter-step-heading',
    gradebook: 'gradebook-step-heading',
  },
  handleFilterBadgeClose: jest.fn().mockName('hooks.handleFilterBadgeClose'),
  mastersHint: 'test-masters-hint',
};
useGradesViewData.mockReturnValue(hookProps);

const updateQueryParams = jest.fn().mockName('props.updateQueryParams');

let el;
describe('GradesView component', () => {
  beforeAll(() => {
    initializeMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    el = render(<GradesView updateQueryParams={updateQueryParams} />);
  });
  describe('render', () => {
    test('component to be rendered', () => {
      expect(el.container).toBeInTheDocument();
    });
    test('filterBadges load close behavior from hook', async () => {
      const user = userEvent.setup();
      await user.click(el.getAllByRole('button', { name: 'close' })[0]); // All the buttons use the same handler
      expect(hookProps.handleFilterBadgeClose).toHaveBeenCalled();
    });
  });
});
