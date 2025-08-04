import { render, screen } from '@testing-library/react';

import Fields from './Fields';

describe('Gradebook Table Fields', () => {
  describe('Username', () => {
    const username = 'MyNameFromHere';
    describe('with external_user_key', () => {
      const props = {
        username,
        userKey: 'My name from another land',
      };
      beforeEach(() => {
        render(<Fields.Username {...props} />);
      });
      it('wraps external user key and username', () => {
        const usernameField = screen.getByText(username);
        expect(usernameField).toBeInTheDocument();
        const userKeyField = screen.getByText(props.userKey);
        expect(userKeyField).toBeInTheDocument();
      });
    });
    describe('without external_user_key', () => {
      beforeEach(() => {
        render(<Fields.Username username={username} />);
      });
      it('wraps username only', () => {
        const usernameField = screen.getByText(username);
        expect(usernameField).toBeInTheDocument();
      });
    });
  });

  describe('Text', () => {
    const value = 'myTag@place.com';
    it('wraps entry value', () => {
      render(<Fields.Text value={value} />);
      const textElement = screen.getByText(value);
      expect(textElement).toBeInTheDocument();
    });
  });
});
