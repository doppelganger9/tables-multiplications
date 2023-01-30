import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TablesMultiplicationsAppComponent } from './app.component';
import { MonMenuComponent } from './mon-menu/mon-menu.component';
import { MaTableMultiplicationComponent } from './ma-table-multiplication/ma-table-multiplication.component';
import { EqualsPipe } from './equals.pipe';
import { RevisionTableComponent } from './revision-table/revision-table.component';
import { StateService } from './store/state.service';
import { createCustomElement } from '@angular/elements';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    TablesMultiplicationsAppComponent,
    MonMenuComponent,
    MaTableMultiplicationComponent,
    EqualsPipe,
    RevisionTableComponent,
  ],
  providers: [StateService],
  entryComponents: [TablesMultiplicationsAppComponent],
})
export class TablesMultiplicationsAppModule {
  constructor(private injector: Injector) {
    const myElement = createCustomElement(TablesMultiplicationsAppComponent, {
      injector,
    });
    customElements.define('tables-multiplications-app', myElement);
  }
  ngDoBootstrap() {}
}
