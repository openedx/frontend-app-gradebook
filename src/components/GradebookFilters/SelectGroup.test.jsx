import React from 'react';
import { render, screen } from '@testing-library/react';

import SelectGroup from './SelectGroup';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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
    test('rendered with all options and label', () => {
      render(<SelectGroup {...props} />);
      expect(screen.getAllByRole('option')).toHaveLength(props.options.length);
      expect(screen.getByLabelText(props.label)).toBeInTheDocument();
    });
    test('disabled', () => {
      render(<SelectGroup {...props} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });
});
