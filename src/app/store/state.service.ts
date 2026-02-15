import {
  Action,
  Question,
  Reponse,
  StatistiqueReponses,
  VersionData
} from '../model';
import {
  BehaviorSubject,
  EMPTY,
  Observable as RxJsObservable,
  map,
  of
} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * L'idée est de stocker ici l'état de l'app sans avoir à dégainer
 * NgRx/NgXs/Redux.
 *
 * La vue appelle des actions.
 * Ces actions mettent à jour l'état interne de ce service.
 * Une action est par convention nommée `verbeObjet(...donnéesObjet...): RxJsObservable<void|Objet>`
 * La vue s'abonne et Observe des données dérivées de cet état interne et se met à jour en conséquence.
 * Ces sélecteurs sont `getXXXX: RxJsObservable<xxx>`
 */
@Injectable()
export class StateService {
  private nombreChoisi$: BehaviorSubject<number>;
  private actionChoisie$: BehaviorSubject<Action>;
  private reponses$: BehaviorSubject<Array<Reponse>>;
  private questions$: BehaviorSubject<Array<Question>>;

  constructor() {
    this.setupInitialState();
  }

  private setupInitialState() {
    this.nombreChoisi$ = new BehaviorSubject<number>(
      nombreAuHasardEntre1Et10()
    );
    this.actionChoisie$ = new BehaviorSubject<Action>('Afficher');
    //this.actionChoisie$ = new BehaviorSubject<Action>('Réviser');
    this.reponses$ = new BehaviorSubject<Array<Reponse>>([] as Array<Reponse>);
    this.questions$ = new BehaviorSubject<Array<Question>>(
      [] as Array<Question>
    );
  }

  // SELECTION
  getNombreChoisi(): RxJsObservable<number> {
    return this.nombreChoisi$.asObservable();
    //      .pipe(tap((nb) => console.log('nombre a changé : ' + nb)))
  }

  // ACTION
  updateNombreChoisi(nombre: number): RxJsObservable<void> {
    console.log('state update nombre : ' + nombre);
    this.nombreChoisi$.next(nombre);
    // et invalider les questions en cours
    return this.terminerToutesLesQuestions();
  }

  // SELECTION
  getActionChoisie(): RxJsObservable<Action> {
    return this.actionChoisie$.asObservable();
    //      .pipe(tap((a) => console.log('action a changé : ' + a)))
  }

  // ACTION
  updateActionChoisie(action: Action): RxJsObservable<void> {
    console.log('state update action : ' + action);
    this.actionChoisie$.next(action);
    // et invalider les questions en cours
    return this.terminerToutesLesQuestions();
  }

  // SELECTION
  getLastQuestion(): RxJsObservable<Question> {
    // ne pas utiliser last ou autre car on emet la liste des question et on aurait que la derniere liste de questions
    // ce qu'on veut c'est la dernière question lorsque une nouvelle liste de question est émise.
    return this.questions$.asObservable().pipe(
      map((questions) =>
        questions && questions.length >= 0
          ? questions[questions.length - 1]
          : null
      )
      //      tap((q) =>
      //        console.log('dernière question a changé : ' + JSON.stringify(q))
      //      )
    );
  }
  getQuestions(): RxJsObservable<Array<Question>> {
    return this.questions$.asObservable();
    //      .pipe(
    //        tap((q) => console.log('questions changées : ' + JSON.stringify(q)))
    //      )
  }

  // ACTION
  generateNewQuestion(): RxJsObservable<Question> {
    // sélections état interne
    const questions = this.questions$.getValue();
    const nombre = this.nombreChoisi$.getValue();
    // calcul et mise à jour du store
    const operande = nombreAuHasardEntre1Et10();
    // TODO aller plus loin que le hasard ? p.ex. basé sur les précédentes réponses ?
    const questionGeneree = {
      nombre,
      operande,
      finie: false,
      total: nombre * operande,
      dateDebut: new Date()
    } as Question;
    // émettre
    this.questions$.next([...questions.map(finirLaQuestion), questionGeneree]);
    console.log('question générée', questionGeneree);
    return of(questionGeneree);
  }

  // SELECTION
  getReponses(): RxJsObservable<Array<Reponse>> {
    return this.reponses$.asObservable();
    //.pipe(tap((x) => console.log(`reponses mis à jour`, x)))
  }

  // SELECTION avec calculs dérivés
  getStatistiquesReponsesGlobales(): RxJsObservable<
    Array<StatistiqueReponses>
  > {
    return this.reponses$.pipe(
      map((reponses) => {
        const reponseByNombre = {};
        reponses.forEach((reponse) => {
          if (!reponseByNombre[reponse.nombre]) {
            reponseByNombre[reponse.nombre] = [];
          }
          reponseByNombre[reponse.nombre].push(reponse);
        });

        const stats = new Array(10).fill({
          max: 0,
          min: Infinity,
          moy: 0,
          reponsesCorrectesSurLEnsemble: 0,
          vuesSurLEnsemble: 0,
          reponses: []
        } as StatistiqueReponses);
        stats.forEach((stat: StatistiqueReponses, index) => {
          stat.reponses = reponseByNombre[index + 1];
          stat.max = stat.reponses.reduce(
            (prev, val) =>
              prev < val.tempsMillisecondes ? val.tempsMillisecondes : prev,
            stat.max
          );
          stat.min = stat.reponses.reduce(
            (prev, val) =>
              prev > val.tempsMillisecondes ? val.tempsMillisecondes : prev,
            stat.min
          );
          stat.moy = stat.reponses.reduce(
            (prev, val, _, array) =>
              prev + val.tempsMillisecondes / array.length,
            stat.moy
          );
          stat.reponsesCorrectesSurLEnsemble = stat.reponses.reduce(
            (prev, curr) => prev + (curr.correcte ? 1 : 0),
            stat.reponsesCorrectesSurLEnsemble
          );
          stat.vuesSurLEnsemble = new Set(
            stat.reponses.map((rep) => rep.operande)
          ).size;
        });
        return stats;
      })
    );
  }

  // ACTION
  terminerToutesLesQuestions(): RxJsObservable<void> {
    // sélection store interne
    const questions = this.questions$.getValue();
    if (questions && questions.length > 0) {
      this.questions$.next([...questions.map(finirLaQuestion)]);
    }
    console.log('toutes les questions sont maintenant passées au statut finie');
    return EMPTY;
  }

  // ACTION
  soumettreReponse(reponse: number): RxJsObservable<Reponse> {
    // sélection store interne
    const reponses = this.reponses$.getValue();
    const questions = this.questions$.getValue();
    const lastQuestion = questions[questions.length - 1];

    // vérifier si l'action est possible !! La question actuelle ne doit pas etre finie
    if (lastQuestion.finie) {
      console.warn('tentative de réponse sur une question finie !');
      return;
    }

    // calculs
    const correcte = lastQuestion.nombre * lastQuestion.operande === reponse;
    const maintenant = new Date();
    const tempsMillisecondes =
      maintenant.getTime() - lastQuestion.dateDebut.getTime();
    const reponseCalculee = {
      nombre: lastQuestion.nombre,
      operande: lastQuestion.operande,
      reponse,
      correcte,
      tempsMillisecondes
    } as Reponse;

    // mise à jour store interne
    // ... on finit la question en cours
    if (correcte) {
      console.log(
        'réponse correcte, les questions sont passées au statut fini'
      );
      this.questions$.next([...questions.map(finirLaQuestion)]);
    } // else : la question n'est pas terminée tant qu'on a pas bien répondu !
    // ... et on émet la réponse
    this.reponses$.next([...reponses, reponseCalculee]);
    // et aussi c'est une promesse qui retourne la valeur.
    console.log('réponse vérifiée', reponseCalculee);
    return of(reponseCalculee);
  }

  // SELECTION
  getVersion(): RxJsObservable<VersionData> {
    return new RxJsObservable((subscriber) => {
      Promise.all([import('package.json'), import('src/git-version.json')])
        .then(([packageJson, gitVersionJson]) => {
          const lastCommitTime = gitVersionJson?.lastCommitTime;
          const time = Date.parse(lastCommitTime);
          const dateTime = new Date(time);
          subscriber.next({
            version: packageJson?.version,
            shortSHA: gitVersionJson?.shortSHA ?? 'inconnue',
            lastCommitTime: dateTime ?? new Date()
          } as VersionData);
        })
        .catch((err) => subscriber.error(err))
        .finally(() => subscriber.complete());
    });
  }
}

function finirLaQuestion(question: Question): Question {
  // on marque automatiquement toutes les anciennes questions à fini
  question.finie = true;
  return question;
}

function nombreAuHasardEntre1Et10() {
  return Math.floor(Math.random() * 10) + 1;
}
