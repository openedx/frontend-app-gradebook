import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import HistoryHeader from './HistoryHeader';

describe('HistoryHeader', () => {
  const props = {
    id: 'water',
    label: 'Brita',
    value: 'hydration',
  };
  describe('Component', () => {
    test('snapshot', () => {
      expect(shallow(<HistoryHeader {...props} />).snapshot).toMatchSnapshot();
    });
  });
});
