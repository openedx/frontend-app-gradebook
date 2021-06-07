import React from 'react';
import { shallow } from 'enzyme';

import PercentGroup from './PercentGroup';

describe('PercentGroup', () => {
  let props = {
    id: 'group id',
    label: 'Group Label',
    value: 'group VALUE',
    disabled: false,
  };

  beforeEach(() => {
    props = {
      ...props,
      onChange: jest.fn().mockName('props.onChange'),
    };
  });

  describe('Component', () => {
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<PercentGroup {...props} />);
        expect(el).toMatchSnapshot();
      });
      test('disabled', () => {
        const el = shallow(<PercentGroup {...props} disabled />);
        expect(el).toMatchSnapshot();
      });
    });
  });
});
