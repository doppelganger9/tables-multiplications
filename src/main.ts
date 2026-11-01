/// <reference types="@angular/localize" />

import { registerLocaleData } from '@angular/common';
import { createApplication } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';
import { TablesMultiplicationsAppComponent } from './app/app.component';
import { ApplicationRef, LOCALE_ID } from '@angular/core';
import { StateService } from './app/store/state.service';
import { createCustomElement } from '@angular/elements';

declare global {
  interface Window {
    ngRef?: ApplicationRef;
  }
}

/**
 * Custom element names this app registers. The host page decides where the app goes:
 * this project's index.html, or another site embedding main.js (https://lacourt.dev/2023/01/21).
 * - `app-tables-multiplications`: current name (same as the component selector);
 * - `tables-multiplications-app`: name used before February 2026, still embedded by lacourt.dev.
 */
export const CUSTOM_ELEMENT_TAGS = [
  'app-tables-multiplications',
  'tables-multiplications-app'
];

registerLocaleData(localeFr);

// createApplication() and not bootstrapApplication(): the latter needs the component's
// root element in the page and fails (NG05104) on a page that only uses the custom element.
createApplication({
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    StateService
  ]
})
  .then((appRef) => {
    for (const tag of CUSTOM_ELEMENT_TAGS) {
      if (!customElements.get(tag)) {
        // a custom element constructor can only be registered once, so one per name
        customElements.define(
          tag,
          createCustomElement(TablesMultiplicationsAppComponent, {
            injector: appRef.injector
          })
        );
      }
    }

    // Hot reload cleanup
    if (window.ngRef) {
      window.ngRef.destroy();
    }
    window.ngRef = appRef;
  })
  .catch((err) => console.error(err));
