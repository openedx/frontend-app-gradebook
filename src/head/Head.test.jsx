import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { getConfig } from '@edx/frontend-platform';
import Head from './Head';

jest.mock('react-helmet', () => ({
  Helmet: () => 'Helmet',
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const config = {
  SITE_NAME: 'test-site-name',
  FAVICON_URL: 'test-favicon-url',
};

getConfig.mockReturnValue(config);

describe('Head', () => {
  it('should match render title tag and favicon with the site configuration values', () => {
    const el = shallow(<Head />);
    const title = el.instance.findByType('title')[0];
    const link = el.instance.findByType('link')[0];
    expect(title.children[0].el).toEqual(`Gradebook | ${config.SITE_NAME}`);
    expect(link.props.rel).toEqual('shortcut icon');
    expect(link.props.href).toEqual(config.FAVICON_URL);
  });
});
