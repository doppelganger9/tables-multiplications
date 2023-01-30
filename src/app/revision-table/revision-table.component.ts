import { Component, Input, OnInit } from '@angular/core';
import {
  Observable,
  combineLatest,
  concat,
  filter,
  map,
  of,
  switchMap,
  timer
} from 'rxjs';
import { Question } from '../model';
import { StateService } from '../store/state.service';

@Component({
  selector: 'app-revision-table',
  templateUrl: './revision-table.component.html',
  styleUrls: ['./revision-table.component.css']
})
export class RevisionTableComponent implements OnInit {
  @Input()
  nombre$: Observable<number>;

  question$: Observable<Question>;
  questions$: Observable<Array<Question>>; // TODO voir si on le garde ou pas
  afficherLaDerniereQuestion$: Observable<boolean>;
  afficherFlashMessageBonneReponse$: Observable<boolean>;
  afficherFlashMessageMauvaiseReponse$: Observable<boolean>;

  reponse: string; // simple template-driven form

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.question$ = this.stateService.getLastQuestion();
    // TODO voir si on garde ou pas
    this.questions$ = this.stateService.getQuestions();

    this.afficherLaDerniereQuestion$ = combineLatest([
      this.question$,
      this.nombre$
    ]).pipe(
      map(
        ([question, nombre]) =>
          !!question && !question.finie && question.nombre == nombre
      )
    );

    // 1|--(x)------------------------------------(x)------------------------------->
    // 2|--(true)--1500ms--(false)----------------(true)--1500ms--(false)----------->
    const emetTrueDeSuitePuisFalseAuBoutDe1500ms = concat(
      of(true),
      timer(1500).pipe(map((_) => false))
    );
    this.afficherFlashMessageBonneReponse$ = this.stateService
      .getReponses()
      .pipe(
        filter(
          (reponses) =>
            reponses &&
            reponses.length > 0 &&
            reponses[reponses.length - 1].correcte
          // TODO et vérifier que la question qui match n'est pas finie !
        ),
        map((reponses) => reponses[reponses.length - 1].correcte),
        // on remplace l'obervable par un autre qui va émettre false au bout de 1500 seconde
        switchMap((x) => emetTrueDeSuitePuisFalseAuBoutDe1500ms)
        //tap((x) => console.log('après le distinct until changed', x))
      );
    this.afficherFlashMessageMauvaiseReponse$ = this.stateService
      .getReponses()
      .pipe(
        filter(
          (reponses) =>
            reponses &&
            reponses.length > 0 &&
            !reponses[reponses.length - 1].correcte
          // TODO et vérifier que la question qui match n'est pas finie !
        ),
        map((reponses) => !reponses[reponses.length - 1].correcte),
        // on remplace l'obervable par un autre qui va émettre false au bout de 1500 seconde
        switchMap((x) => emetTrueDeSuitePuisFalseAuBoutDe1500ms)
        //tap((x) => console.log('après le distinct until changed', x))
      );
  }

  clicQuestionSuivante(): void {
    this.stateService.generateNewQuestion();
  }

  clicValiderReponse(): void {
    const total = 0 + Number(this.reponse);

    this.stateService.soumettreReponse(total).then((reponse) => {
      // remise à vide du champs réponse
      this.reponse = '';
      // si reponse OK / Question finie, alors on demande la prochaine question.
      if (reponse.correcte) {
        this.stateService.generateNewQuestion();
      }
    });
  }
}
