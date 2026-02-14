import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr-FR');

export default [
  provideZonelessChangeDetection(),
  {
    provide: LOCALE_ID,
    useValue: 'fr-FR'
  }
];
