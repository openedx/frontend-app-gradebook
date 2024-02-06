import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import Fields from './Fields';

describe('Gradebook Table Fields', () => {
  describe('Username', () => {
    let el;
    const username = 'MyNameFromHere';
    describe('with external_user_key', () => {
      const props = {
        username,
        userKey: 'My name from another land',
      };
      beforeEach(() => {
        el = shallow(<Fields.Username {...props} />);
      });
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('wraps external user key and username', () => {
        expect(el.instance.findByType('span')[0].el).toMatchSnapshot();
        const content = el.instance.findByType('span')[0].children[0];
        expect(content.children[0].children[0].el).toEqual(username);
        expect(content.children[1].children[0].el).toEqual(props.userKey);
      });
    });
    describe('without external_user_key', () => {
      beforeEach(() => {
        el = shallow(<Fields.Username username={username} />);
      });
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('wraps username only', () => {
        const content = el.instance.findByType('span')[0].children[0];
        expect(content.children[0].children[0].el).toEqual(username);
        expect(content.children).toHaveLength(1);
      });
    });
  });

  describe('Text', () => {
    const value = 'myTag@place.com';
    test('snapshot', () => {
      expect(shallow(<Fields.Text value={value} />).snapshot).toMatchSnapshot();
    });
    test('wraps entry value', () => {
      expect(shallow(<Fields.Text value={value} />).instance.children[0].el).toEqual(value);
    });
  });
});
