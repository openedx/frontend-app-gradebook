import React from 'react';
import { shallow } from 'enzyme';

import { SearchField } from '@edx/paragon';

import useSearchControlsData from './hooks';
import SearchControls from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  onSubmit: jest.fn().mockName('hooks.onSubmit'),
  onBlur: jest.fn().mockName('hooks.onBlur'),
  onClear: jest.fn().mockName('hooks.onClear'),
  searchValue: 'test-search-value',
  inputLabel: 'test-input-label',
  hintText: 'test-hint-text',
};
useSearchControlsData.mockReturnValue(hookProps);

let el;
describe('SearchControls component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<SearchControls />);
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      expect(useSearchControlsData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('search field', () => {
      const props = el.find(SearchField).props();
      expect(props.onSubmit).toEqual(hookProps.onSubmit);
      expect(props.onBlur).toEqual(hookProps.onBlur);
      expect(props.onClear).toEqual(hookProps.onClear);
      expect(props.inputLabel).toEqual(hookProps.inputLabel);
      expect(props.value).toEqual(hookProps.searchValue);
    });
    test('hint text', () => {
      expect(el.find('small').text()).toEqual(hookProps.hintText);
    });
  });
});
