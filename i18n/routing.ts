import {defineRouting} from 'next-intl/routing';
import {locales, pathnames} from './pathnames';

export const routing = defineRouting({
  defaultLocale: 'en',
  locales,
  pathnames
});