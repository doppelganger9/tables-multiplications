import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Action } from './model';
import { StateService } from './store/state.service';

/**
 * Gère l'app dans sa globalité en propageant aux composant fils et
 * appelant les services.
 */
@Component({
  selector: 'app-shell',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesMultiplicationsAppComponent implements OnInit {
  nombreChoisi$: Observable<number>;
  actionChoisie$: Observable<Action>;
  modeAffichage$: Observable<boolean>;

  private readonly stateService: StateService = inject(StateService);

  ngOnInit() {
    this.nombreChoisi$ = this.stateService.getNombreChoisi();
    this.actionChoisie$ = this.stateService.getActionChoisie();
    this.modeAffichage$ = this.actionChoisie$.pipe(
      map((actionChoisie) => actionChoisie === 'Afficher')
    );
  }
}
