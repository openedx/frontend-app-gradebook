import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Download } from '@openedx/paragon/icons';

import lms from 'data/services/lms';
import ResultsSummary from './ResultsSummary';

jest.mock('@openedx/paragon', () => ({
  Hyperlink: () => 'Hyperlink',
  Icon: () => 'Icon',
}));
jest.mock('@openedx/paragon/icons', () => ({
  Download: 'DownloadIcon',
}));
jest.mock('data/services/lms', () => ({
  urls: {
    bulkGradesUrlByRow: jest.fn((rowId) => ({ url: { rowId } })),
  },
}));

describe('ResultsSummary component', () => {
  const props = {
    rowId: 42,
    text: 'texty',
  };
  let el;
  const assertions = [
    'safe hyperlink with bulkGradesUrl with course and row id',
    'download icon',
    'results text',
  ];
  beforeEach(() => {
    el = shallow(<ResultsSummary {...props} />);
  });
  test(`snapshot - ${assertions.join(', ')}`, () => {
    expect(el.snapshot).toMatchSnapshot();
  });
  test('Hyperlink has target="_blank" and rel="noopener noreferrer"', () => {
    expect(el.instance.props.target).toEqual('_blank');
    expect(el.instance.props.rel).toEqual('noopener noreferrer');
  });
  test('Hyperlink has href to bulkGradesUrl', () => {
    expect(el.instance.props.href).toEqual(lms.urls.bulkGradesUrlByRow(props.rowId));
  });
  test('displays Download Icon and text', () => {
    const icon = el.instance.children[0];
    expect(icon.type).toEqual('Icon');
    expect(icon.props.src).toEqual(Download);
    expect(el.instance.children[1].el).toEqual(props.text);
  });
});
