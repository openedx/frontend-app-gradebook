import React from 'react';
import { shallow } from 'enzyme';

import { Icon } from '@edx/paragon';
import { Download } from '@edx/paragon/icons';

import lms from 'data/services/lms';
import ResultsSummary from './ResultsSummary';

jest.mock('@edx/paragon', () => ({
  Hyperlink: () => 'Hyperlink',
  Icon: () => 'Icon',
}));
jest.mock('@edx/paragon/icons', () => ({
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
    expect(el).toMatchSnapshot();
  });
  test('Hyperlink has target="_blank" and rel="noopener noreferrer"', () => {
    expect(el.props().target).toEqual('_blank');
    expect(el.props().rel).toEqual('noopener noreferrer');
  });
  test('Hyperlink has href to bulkGradesUrl', () => {
    expect(el.props().href).toEqual(lms.urls.bulkGradesUrlByRow(props.rowId));
  });
  test('displays Download Icon and text', () => {
    const icon = el.childAt(0);
    expect(icon.is(Icon)).toEqual(true);
    expect(icon.props().src).toEqual(Download);
    expect(el.childAt(1).text()).toEqual(props.text);
  });
});
