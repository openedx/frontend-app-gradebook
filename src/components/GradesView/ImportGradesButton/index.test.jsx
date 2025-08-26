import React from 'react';

import {
  render, screen, initializeMocks,
} from 'testUtilsExtra';

import ImportGradesButton from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

initializeMocks();

describe('ImportGradesButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ImportGradesButton />);
  });

  describe('render', () => {
    test('Form', async () => {
      const uploader = screen.getByTestId('file-control');
      expect(uploader).toBeInTheDocument();
    });
    test('import button', () => {
      expect(screen.getByRole('button', { name: 'Import Grades' })).toBeInTheDocument();
    });
  });
});
