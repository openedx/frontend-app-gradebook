import React from 'react';
import { shallow } from 'enzyme';

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
        expect(el).toMatchSnapshot();
      });
      test('wraps external user key and username', () => {
        expect(el.find('span').childAt(0)).toMatchSnapshot();
        expect(el.find('span').childAt(0)).toMatchSnapshot();
        const content = el.find('span').childAt(0);
        expect(content.childAt(0).text()).toEqual(username);
        expect(content.childAt(1).text()).toEqual(props.userKey);
      });
    });
    describe('without external_user_key', () => {
      beforeEach(() => {
        el = shallow(<Fields.Username username={username} />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      test('wraps username only', () => {
        const content = el.find('span').childAt(0);
        expect(content.childAt(0).text()).toEqual(username);
        expect(content.children()).toHaveLength(1);
      });
    });
  });

  describe('Email', () => {
    const email = 'myTag@place.com';
    test('snapshot', () => {
      expect(shallow(<Fields.Email email={email} />)).toMatchSnapshot();
    });
    test('wraps entry email', () => {
      expect(shallow(<Fields.Email email={email} />).text()).toEqual(email);
    });
  });
});
