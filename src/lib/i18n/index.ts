// ============================================================
// I18N — Re-exports and locale registry
// ============================================================

export type { Locale, Translations } from './types';
export { EN } from './en';
export { AR } from './ar';
export { ES } from './es';
export { FR } from './fr';

import type { Locale, Translations } from './types';
import { EN } from './en';
import { AR } from './ar';
import { ES } from './es';
import { FR } from './fr';

export const LOCALES: { code: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
];

const TRANSLATIONS: Record<Locale, Translations> = { en: EN, ar: AR, es: ES, fr: FR };

export function t(locale: Locale): Translations {
  return TRANSLATIONS[locale] || TRANSLATIONS.en;
}
