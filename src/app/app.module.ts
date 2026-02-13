import {
  ApplicationRef,
  DoBootstrap,
  Injector,
  LOCALE_ID,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './mon-menu/menu.component';
import { RevisionTableComponent } from './revision-table/revision-table.component';
import { StateService } from './store/state.service';
import { TableMultiplicationComponent } from './ma-table-multiplication/table-multiplication.component';
import { TablesMultiplicationsAppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { MonFooterComponent } from './mon-footer/mon-footer.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PushPipe } from './push.pipe';

registerLocaleData(localeFr);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TableMultiplicationComponent,
    RevisionTableComponent,
    MenuComponent,
    MonFooterComponent,
    PushPipe,
  ],
  declarations: [
    TablesMultiplicationsAppComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    StateService
  ]
})
export class TablesMultiplicationsAppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const myElement = createCustomElement(TablesMultiplicationsAppComponent, {
      injector
    });
    customElements.define('tables-multiplications-app', myElement);
  }
  ngDoBootstrap(appRef: ApplicationRef) {
    // TODO quelque chose à faire ici ?
    console.log(appRef);
  }
}
