import React from 'react';
import { render, screen } from '@testing-library/react';

import selectors from 'data/selectors';

import { BulkManagementAlerts, mapStateToProps } from './BulkManagementAlerts';

jest.unmock('@openedx/paragon');
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkImportError: (state) => ({ bulkImportError: state }),
      uploadSuccess: (state) => ({ uploadSuccess: state }),
    },
  },
}));

const errorMessage = 'Oh noooooo';

describe('BulkManagementAlerts', () => {
  describe('component', () => {
    describe('states of the warnings', () => {
      test('no alert shown', () => {
        const el = render(<BulkManagementAlerts bulkImportError="" uploadSuccess={false} />);
        expect(el.container.querySelectorAll('.alert').length).toEqual(0);
      });
      test('Just success alert shown', () => {
        const el = render(<BulkManagementAlerts bulkImportError="" uploadSuccess />);
        expect(el.container.querySelectorAll('.alert-success').length).toEqual(1);
      });
      test('Just error alert shown', () => {
        const el = render(<BulkManagementAlerts bulkImportError={errorMessage} uploadSuccess={false} />);
        expect(el.container.querySelectorAll('.alert-danger').length).toEqual(1);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { a: 'puppy', named: 'Ember' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('bulkImportError from grades.bulkImportError', () => {
      expect(mapped.bulkImportError).toEqual(selectors.grades.bulkImportError(testState));
    });
    test('uploadSuccess from grades.uploadSuccess', () => {
      expect(mapped.uploadSuccess).toEqual(selectors.grades.uploadSuccess(testState));
    });
  });
});
