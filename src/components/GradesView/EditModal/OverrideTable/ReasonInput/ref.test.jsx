import React from 'react';
import { render } from '@testing-library/react';

import useReasonInputData from './hooks';
import ReasonInput, { controlTestId } from '.';

jest.unmock('react');
jest.unmock('@edx/paragon');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const focus = jest.fn();
const props = {
  value: 'test-value',
  onChange: jest.fn(),
  ref: { current: { focus }, useRef: jest.fn() },
};
useReasonInputData.mockReturnValue(props);

let el;
describe('ReasonInput ref', () => {
  it('loads ref from hook', () => {
    el = render(<ReasonInput />);
    const control = el.getByTestId(controlTestId);
    expect(control).toEqual(props.ref.current);
  });
});
