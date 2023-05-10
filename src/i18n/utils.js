import { getLocale, isRtl } from '@edx/frontend-platform/i18n';

export const getLocalizedSlash = () => {
  // For fractional grades
  // if we are in a LTR language, we want to use a forward slash.
  // If we are in a RTL language, we want to use a backslash instead
  if (isRtl(getLocale())) {
    return '\\';
  }
  return '/';
};

export const getLocalizedPercentSign = () => {
  // LTR languages put the percent to the right of a number.
  // RTL languages put the percent sign to the left of the number.
  // We can place a non-printing unicode right-to-left marker next to the percent
  // sign to make it print to the left of the number if we are currently in a LTR language
  if (isRtl(getLocale())) {
    return '\u200f%';
  }
  return '%';
};
