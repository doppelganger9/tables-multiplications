import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EqualsPipe } from '../equals.pipe';
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
  selector: 'mon-menu',
  templateUrl: './mon-menu.component.html',
  styleUrls: ['./mon-menu.component.css'],
  providers: [EqualsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonMenuComponent implements OnInit {
  nombreChoisi$: Observable<number>;
  actionChoisie$: Observable<Action>;
  optionNombres$: Observable<Array<Option<number>>>;
  optionActions$: Observable<Array<Option<Action>>>;

  constructor(private stateService: StateService, equalsPipe: EqualsPipe) {}

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

  choisirNombre(event: any): void {
    const nombreChoisi: number = +event.target.value;
    this.stateService.updateNombreChoisi(nombreChoisi);
  }

  choisirAction(event: any): void {
    const actionChoisie: Action = event.target.value;
    this.stateService.updateActionChoisie(actionChoisie);
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
      label: `${i}`,
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
        label: `${action}`,
      } as Option<Action>)
  );
}
