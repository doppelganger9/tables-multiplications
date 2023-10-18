import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Action } from '../model';
import { StateService } from '../store/state.service';

interface Option<T> {
  selected: boolean;
  value: T;
  label: string;
}

/**
 * Permet de choisir un nombre (1-9),
 * et une action (afficher, réviser)
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  nombreChoisi$: Observable<number>;
  actionChoisie$: Observable<Action>;
  optionNombres$: Observable<Array<Option<number>>>;
  optionActions$: Observable<Array<Option<Action>>>;

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.nombreChoisi$ = this.stateService.getNombreChoisi();
    this.actionChoisie$ = this.stateService.getActionChoisie();
    this.optionNombres$ = this.nombreChoisi$.pipe(
      map((nombre) => toutesLesOptionsDeChoixDeNombre(nombre))
    );
    this.optionActions$ = this.actionChoisie$.pipe(
      map((action) => toutesLesOptionsDeChoixDAction(action))
    );
  }

  choisirNombre(event: any): Observable<void> {
    const nombreChoisi: number = +event.target.value;
    return this.stateService.updateNombreChoisi(nombreChoisi);
  }

  choisirAction(event: any): Observable<void> {
    const actionChoisie: Action = event.target.value;
    return this.stateService.updateActionChoisie(actionChoisie);
  }
}

function toutesLesOptionsDeChoixDeNombre(
  nombreActuel: number
): Array<Option<number>> {
  let res = [];
  for (let i = 1; i <= 10; i++) {
    res.push({
      selected: i === nombreActuel,
      value: i,
      label: `${i}`
    } as Option<number>);
  }
  return res;
}

function toutesLesOptionsDeChoixDAction(
  actionActuelle: Action
): Array<Option<Action>> {
  return (['Afficher', 'Réviser'] as Array<Action>).map(
    (action) =>
      ({
        selected: action === actionActuelle,
        value: action,
        label: `${action}`
      }) as Option<Action>
  );
}
