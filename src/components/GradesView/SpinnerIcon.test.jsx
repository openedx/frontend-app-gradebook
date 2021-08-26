import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import { SpinnerIcon, mapStateToProps } from './SpinnerIcon';

jest.mock('@edx/paragon', () => ({
  Icon: () => 'Icon',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: { shouldShowSpinner: state => ({ shouldShowSpinner: state }) },
  },
}));

describe('SpinnerIcon', () => {
  describe('component', () => {
    it('snapshot - does not render if show: false', () => {
      expect(shallow(<SpinnerIcon />)).toMatchSnapshot();
    });
    test('snapshot - displays spinner overlay with spinner icon', () => {
      expect(shallow(<SpinnerIcon show />)).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { a: 'nice', day: 'for', some: 'sun' };
    test('show from root.shouldShowSpinner', () => {
      expect(mapStateToProps(testState).show).toEqual(selectors.root.shouldShowSpinner(testState));
    });
  });
});
