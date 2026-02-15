/// <reference types="@angular/localize" />

import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';
import { TablesMultiplicationsAppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import { StateService } from './app/store/state.service';
import { createCustomElement } from '@angular/elements';

registerLocaleData(localeFr);

bootstrapApplication(TablesMultiplicationsAppComponent, {
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    StateService
  ]
})
  .then((appRef) => {
    // Create custom element
    const customElement = createCustomElement(
      TablesMultiplicationsAppComponent,
      {
        injector: appRef.injector
      }
    );
    customElements.define('app-tables-multiplications', customElement);

    // Hot reload cleanup
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = appRef;
  })
  .catch((err) => console.error(err));
