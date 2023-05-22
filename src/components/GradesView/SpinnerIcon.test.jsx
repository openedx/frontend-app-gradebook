import React from 'react';
import { shallow } from 'enzyme';

import { selectors } from 'data/redux/hooks';
import SpinnerIcon from './SpinnerIcon';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: { useShouldShowSpinner: jest.fn() },
  },
}));

selectors.root.useShouldShowSpinner.mockReturnValue(true);
let el;
describe('SpinnerIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<SpinnerIcon />);
  });
  describe('behavior', () => {
    it('initializes redux hook', () => {
      expect(selectors.root.useShouldShowSpinner).toHaveBeenCalled();
    });
  });
  describe('component', () => {
    it('does not render if show: false', () => {
      selectors.root.useShouldShowSpinner.mockReturnValueOnce(false);
      el = shallow(<SpinnerIcon />);
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot - displays spinner overlay with spinner icon', () => {
      expect(el).toMatchSnapshot();
    });
  });
});
