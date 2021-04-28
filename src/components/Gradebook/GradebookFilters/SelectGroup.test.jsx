import React from 'react';
import { shallow } from 'enzyme';

import SelectGroup from './SelectGroup';

describe('SelectGroup', () => {
  let props = {
    id: 'group id',
    label: 'Group Label',
    value: 'group VALUE',
    disabled: false,
    options: [
      <option value="opt1" key="opt1">Option 1</option>,
      <option value="opt2" key="opt2">Option 2</option>,
      <option value="opt3" key="opt3">Option 3</option>,
    ],
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
        const el = shallow(<SelectGroup {...props} />);
        expect(el).toMatchSnapshot();
      });
      test('disabled', () => {
        const el = shallow(<SelectGroup {...props} disabled />);
        expect(el).toMatchSnapshot();
      });
    });
  });
});
