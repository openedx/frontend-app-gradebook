import { isRtl } from '@openedx/frontend-base';
import { getLocalizedSlash, getLocalizedPercentSign } from './utils';

jest.mock('@openedx/frontend-base', () => ({
  isRtl: jest.fn(),
  getLocale: jest.fn(),
}));

describe('getLocalizedSlash', () => {
  it('ltr', () => {
    isRtl.mockReturnValueOnce(false);
    expect(getLocalizedSlash()).toEqual('/');
  });
  it('rtl', () => {
    isRtl.mockReturnValueOnce(true);
    expect(getLocalizedSlash()).toEqual('\\');
  });
});

describe('getLocalizedPercentSign', () => {
  it('ltr', () => {
    isRtl.mockReturnValueOnce(false);
    expect(getLocalizedPercentSign()).toEqual('%');
  });
  it('rtl', () => {
    isRtl.mockReturnValueOnce(true);
    expect(getLocalizedPercentSign()).toEqual('\u200f%');
  });
});
