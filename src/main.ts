/// <reference types="@angular/localize" />

import { TablesMultiplicationsAppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';

platformBrowser()
  .bootstrapModule(TablesMultiplicationsAppModule)
  .then((ref) => {
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = ref;

    // Otherwise, log the boot error
  })
  .catch((err) => console.error(err));
