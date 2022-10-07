import { getLocale, isRtl } from '@edx/frontend-platform/i18n';
import arMessages from './messages/ar.json';
import deMessages from './messages/de.json';
import es419Messages from './messages/es_419.json';
import faIRMessages from './messages/fa_IR.json';
import frMessages from './messages/fr.json';
import frCAMessages from './messages/fr_CA.json';
import hiMessages from './messages/hi.json';
import itMessages from './messages/it.json';
import ptMessages from './messages/pt.json';
import ruMessages from './messages/ru.json';
import ukMessages from './messages/uk.json';
import zhcnMessages from './messages/zh_CN.json';
// no need to import en messages-- they are in the defaultMessage field

const messages = {
  ar: arMessages,
  'es-419': es419Messages,
  'fa-ir': faIRMessages,
  fr: frMessages,
  'zh-cn': zhcnMessages,
  pt: ptMessages,
  it: itMessages,
  de: deMessages,
  hi: hiMessages,
  'fr-ca': frCAMessages,
  ru: ruMessages,
  uk: ukMessages,
};

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

export default messages;
