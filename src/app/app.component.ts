import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  OnInit,
  inject
} from '@angular/core';
import { Observable as RxJsObservable, map } from 'rxjs';
import { Action } from './model';
import { StateService } from './store/state.service';
import { TableMultiplicationComponent } from './ma-table-multiplication/table-multiplication.component';
import { RevisionTableComponent } from './revision-table/revision-table.component';
import { MenuComponent } from './mon-menu/menu.component';
import { MonFooterComponent } from './mon-footer/mon-footer.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';

/**
 * Gère l'app dans sa globalité en propageant aux composant fils et
 * appelant les services.
 */
@Component({
  selector: 'app-tables-multiplications',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BrowserModule,
    FormsModule,
    TableMultiplicationComponent,
    RevisionTableComponent,
    MenuComponent,
    MonFooterComponent,
    AsyncPipe
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    StateService
  ],
  standalone: true
})
export class TablesMultiplicationsAppComponent implements OnInit {
  nombreChoisi$: RxJsObservable<number>;
  actionChoisie$: RxJsObservable<Action>;
  modeAffichage$: RxJsObservable<boolean>;

  private readonly stateService: StateService = inject(StateService);

  ngOnInit() {
    this.nombreChoisi$ = this.stateService.getNombreChoisi();
    this.actionChoisie$ = this.stateService.getActionChoisie();
    this.modeAffichage$ = this.actionChoisie$.pipe(
      map((actionChoisie) => actionChoisie === 'Afficher')
    );
  }
}
