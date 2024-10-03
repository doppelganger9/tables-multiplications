/// <reference types="@angular/localize" />

import { TablesMultiplicationsAppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic()
  .bootstrapModule(TablesMultiplicationsAppModule, {
    ngZone: 'noop'
  })
  .then((ref) => {
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = ref;

    // Otherwise, log the boot error
  })
  .catch((err) => console.error(err));
