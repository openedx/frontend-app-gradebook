import React from 'react';

import { initializeMocks, render, screen } from 'testUtilsExtra';

import usePageButtonsData from './hooks';
import PageButtons from '.';

jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('react');
jest.mock('./hooks', () => jest.fn());

const hookProps = {
  prev: {
    disabled: false,
    onClick: jest.fn().mockName('hooks.prev.onClick'),
    text: 'prev-text',
  },
  next: {
    disabled: false,
    onClick: jest.fn().mockName('hooks.next.onClick'),
    text: 'next-text',
  },
};

describe('PageButtons component', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    initializeMocks();
  });
  describe('renders enabled buttons', () => {
    beforeEach(() => {
      usePageButtonsData.mockReturnValue(hookProps);
      render(<PageButtons />);
    });
    test('prev button enabled', () => {
      expect(screen.getByText(hookProps.prev.text)).toBeInTheDocument();
      expect(screen.getByText(hookProps.next.text)).toBeEnabled();
    });
    test('next button enabled', () => {
      expect(screen.getByText(hookProps.next.text)).toBeInTheDocument();
      expect(screen.getByText(hookProps.prev.text)).toBeEnabled();
    });
  });

  describe('renders disabled buttons', () => {
    beforeAll(() => {
      hookProps.prev.disabled = true;
      hookProps.next.disabled = true;
    });
    beforeEach(() => {
      usePageButtonsData.mockReturnValue(hookProps);
      render(<PageButtons />);
    });
    test('prev button disabled', () => {
      expect(screen.getByText(hookProps.next.text)).toBeInTheDocument();
      expect(screen.getByText(hookProps.prev.text)).toBeDisabled();
    });
    test('next button disabled', () => {
      expect(screen.getByText(hookProps.prev.text)).toBeInTheDocument();
      expect(screen.getByText(hookProps.next.text)).toBeDisabled();
    });
  });
});
