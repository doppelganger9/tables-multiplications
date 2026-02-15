import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { Observable as RxJsObservable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Action } from '../model';
import { StateService } from '../store/state.service';

interface TMOption<T> {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe]
})
export class MenuComponent implements OnInit {
  nombreChoisi$: RxJsObservable<number>;
  actionChoisie$: RxJsObservable<Action>;
  optionNombres$: RxJsObservable<Array<TMOption<number>>>;
  optionActions$: RxJsObservable<Array<TMOption<Action>>>;

  private readonly stateService: StateService = inject(StateService);

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

  choisirNombre(event: any): RxJsObservable<void> {
    const nombreChoisi: number = +event.target.value;
    return this.stateService.updateNombreChoisi(nombreChoisi);
  }

  choisirAction(event: any): RxJsObservable<void> {
    const actionChoisie: Action = event.target.value;
    return this.stateService.updateActionChoisie(actionChoisie);
  }
}

function toutesLesOptionsDeChoixDeNombre(
  nombreActuel: number
): Array<TMOption<number>> {
  let res = [];
  for (let i = 1; i <= 10; i++) {
    res.push({
      selected: i === nombreActuel,
      value: i,
      label: `${i}`
    } as TMOption<number>);
  }
  return res;
}

function toutesLesOptionsDeChoixDAction(
  actionActuelle: Action
): Array<TMOption<Action>> {
  return (['Afficher', 'Réviser'] as Array<Action>).map(
    (action) =>
      ({
        selected: action === actionActuelle,
        value: action,
        label: `${action}`
      }) as TMOption<Action>
  );
}
