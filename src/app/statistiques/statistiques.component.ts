import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  BehaviorSubject,
  Observable as RxJsObservable,
  combineLatest,
  map
} from 'rxjs';
import { Reponse, StatistiqueReponses } from '../model';
import { StateService } from '../store/state.service';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, DecimalPipe]
})
export class StatistiquesComponent implements OnInit {
  statistiques$!: RxJsObservable<Array<StatistiqueReponses>>;
  statistiqueSelectionnee$!: RxJsObservable<StatistiqueReponses>;
  tableSelectionnee = 1;

  private readonly tableSelectionnee$ = new BehaviorSubject<number>(1);

  private readonly stateService: StateService = inject(StateService);

  ngOnInit(): void {
    this.statistiques$ = this.stateService.getStatistiquesReponsesGlobales();
    this.statistiqueSelectionnee$ = combineLatest([
      this.statistiques$,
      this.tableSelectionnee$
    ]).pipe(map(([statistiques, table]) => statistiques[table - 1]));
  }

  selectionnerTable(table: number): void {
    this.tableSelectionnee = table;
    this.tableSelectionnee$.next(table);
  }

  reponsesPourOperande(
    statistique: StatistiqueReponses,
    operande: number
  ): Array<Reponse> {
    return statistique.reponses.filter(
      (reponse) => reponse.operande === operande
    );
  }

  nombreDeReponses(
    statistique: StatistiqueReponses,
    operande: number,
    correcte: boolean
  ): number {
    return this.reponsesPourOperande(statistique, operande).filter(
      (reponse) => reponse.correcte === correcte
    ).length;
  }

  tempsMoyenPourOperande(
    statistique: StatistiqueReponses,
    operande: number
  ): number {
    const reponses = this.reponsesPourOperande(statistique, operande);
    return (
      reponses.reduce(
        (total, reponse) => total + reponse.tempsMillisecondes,
        0
      ) / (reponses.length || 1)
    );
  }

  hauteurBarre(
    statistique: StatistiqueReponses,
    operande: number,
    correcte: boolean
  ): number {
    const maximum = Math.max(
      ...Array.from(
        { length: 10 },
        (_, index) => this.reponsesPourOperande(statistique, index + 1).length
      ),
      1
    );
    return (
      (this.nombreDeReponses(statistique, operande, correcte) / maximum) * 100
    );
  }

  hauteurBarreTemps(
    statistique: StatistiqueReponses,
    operande: number
  ): number {
    const maximum = Math.max(
      ...Array.from({ length: 10 }, (_, index) =>
        this.tempsMoyenPourOperande(statistique, index + 1)
      ),
      1
    );
    return (this.tempsMoyenPourOperande(statistique, operande) / maximum) * 100;
  }

  reinitialiser(): RxJsObservable<void> {
    return this.stateService.reinitialiserStatistiques();
  }
}
