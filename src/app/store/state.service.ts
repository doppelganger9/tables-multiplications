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
  private static readonly reponsesStorageKey =
    'tables-multiplications.reponses.v1';
  private nombreChoisi$!: BehaviorSubject<number>;
  private actionChoisie$!: BehaviorSubject<Action>;
  private reponses$!: BehaviorSubject<Array<Reponse>>;
  private questions$!: BehaviorSubject<Array<Question>>;

  constructor() {
    this.setupInitialState();
  }

  private setupInitialState() {
    this.nombreChoisi$ = new BehaviorSubject<number>(
      nombreAuHasardEntre1Et10()
    );
    this.actionChoisie$ = new BehaviorSubject<Action>('Afficher');
    //this.actionChoisie$ = new BehaviorSubject<Action>('Réviser');
    this.reponses$ = new BehaviorSubject<Array<Reponse>>(
      this.chargerReponses()
    );
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
  getLastQuestion(): RxJsObservable<Question | null> {
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
    const derniereQuestion = questions[questions.length - 1];
    const operande = this.choisirOperande(nombre, derniereQuestion);
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
        const reponseByNombre: Record<number, Array<Reponse>> = {};
        reponses.forEach((reponse) => {
          if (!reponseByNombre[reponse.nombre]) {
            reponseByNombre[reponse.nombre] = [];
          }
          reponseByNombre[reponse.nombre].push(reponse);
        });

        const stats = Array.from(
          { length: 10 },
          () =>
            ({
              max: 0,
              min: Infinity,
              moy: 0,
              ecartType: 0,
              reponsesCorrectesSurLEnsemble: 0,
              reponsesIncorrectesSurLEnsemble: 0,
              vuesSurLEnsemble: 0,
              reponses: []
            }) as StatistiqueReponses
        );
        stats.forEach((stat: StatistiqueReponses, index) => {
          stat.reponses = reponseByNombre[index + 1] ?? [];
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
          stat.ecartType = Math.sqrt(
            stat.reponses.reduce(
              (prev, val) =>
                prev + Math.pow(val.tempsMillisecondes - stat.moy, 2),
              0
            ) / (stat.reponses.length || 1)
          );
          stat.reponsesCorrectesSurLEnsemble = stat.reponses.reduce(
            (prev, curr) => prev + (curr.correcte ? 1 : 0),
            stat.reponsesCorrectesSurLEnsemble
          );
          stat.reponsesIncorrectesSurLEnsemble =
            stat.reponses.length - stat.reponsesCorrectesSurLEnsemble;
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
      return EMPTY;
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
      tempsMillisecondes,
      repetitions: nombreDeRepetitions(reponses, lastQuestion),
      prochaineRevision: prochaineDateDeRevision(
        correcte,
        nombreDeRepetitions(reponses, lastQuestion),
        tempsMillisecondes
      )
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
    this.sauvegarderReponses(this.reponses$.getValue());
    // et aussi c'est une promesse qui retourne la valeur.
    console.log('réponse vérifiée', reponseCalculee);
    return of(reponseCalculee);
  }

  // SELECTION
  getVersion(): RxJsObservable<VersionData> {
    return new RxJsObservable((subscriber) => {
      Promise.all([
        import('../../../package.json'),
        import('../../git-version.json')
      ])
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

  // ACTION
  reinitialiserStatistiques(): RxJsObservable<void> {
    this.reponses$.next([]);
    this.sauvegarderReponses([]);
    return of(undefined);
  }

  private choisirOperande(
    nombre: number,
    derniereQuestion: Question | undefined
  ): number {
    const maintenant = Date.now();
    const operandes = Array.from({ length: 10 }, (_, index) => index + 1);
    const candidats = operandes.filter(
      (operande) =>
        !derniereQuestion ||
        derniereQuestion.nombre !== nombre ||
        derniereQuestion.operande !== operande
    );
    const reponses = this.reponses$
      .getValue()
      .filter((reponse) => reponse.nombre === nombre);
    const priorites = candidats.map((operande) => {
      const historique = reponses.filter(
        (reponse) => reponse.operande === operande
      );
      const derniereReponse = historique[historique.length - 1];
      const estEchue =
        !derniereReponse ||
        (derniereReponse.prochaineRevision ?? 0) <= maintenant;
      const nombreErreurs = historique.filter(
        (reponse) => !reponse.correcte
      ).length;
      const tempsMoyen =
        historique.reduce(
          (total, reponse) => total + reponse.tempsMillisecondes,
          0
        ) / (historique.length || 1);

      return {
        operande,
        estEchue,
        poids: !derniereReponse
          ? 3
          : 1 + nombreErreurs * 4 + (tempsMoyen >= 3000 ? 3 : 0)
      };
    });

    const aReviser = priorites.filter((candidat) => candidat.estEchue);
    const pool = aReviser.length > 0 ? aReviser : priorites;
    const total = pool.reduce((somme, candidat) => somme + candidat.poids, 0);
    let tirage = Math.random() * total;
    return (
      pool.find((candidat) => {
        tirage -= candidat.poids;
        return tirage < 0;
      })?.operande ??
      candidats[0] ??
      nombreAuHasardEntre1Et10()
    );
  }

  private chargerReponses(): Array<Reponse> {
    try {
      const valeur = localStorage.getItem(StateService.reponsesStorageKey);
      return valeur ? (JSON.parse(valeur) as Array<Reponse>) : [];
    } catch {
      return [];
    }
  }

  private sauvegarderReponses(reponses: Array<Reponse>): void {
    try {
      localStorage.setItem(
        StateService.reponsesStorageKey,
        JSON.stringify(reponses)
      );
    } catch {
      // Le stockage peut être indisponible en mode privé ou hors navigateur.
    }
  }
}

function nombreDeRepetitions(
  reponses: Array<Reponse>,
  question: Question
): number {
  const historique = reponses.filter(
    (reponse) =>
      reponse.nombre === question.nombre &&
      reponse.operande === question.operande
  );
  const derniereReponse = historique[historique.length - 1];
  return derniereReponse?.correcte ? (derniereReponse.repetitions ?? 0) + 1 : 0;
}

function prochaineDateDeRevision(
  correcte: boolean,
  repetitions: number,
  tempsMillisecondes: number
): number {
  if (!correcte) {
    return Date.now();
  }
  if (tempsMillisecondes >= 3000) {
    return Date.now();
  }
  const intervalleEnJours = Math.min(
    30,
    Math.pow(2, Math.max(0, repetitions - 1)) *
      (tempsMillisecondes <= 1000 ? 2 : 1)
  );
  return Date.now() + intervalleEnJours * 24 * 60 * 60 * 1000;
}

function finirLaQuestion(question: Question): Question {
  // on marque automatiquement toutes les anciennes questions à fini
  question.finie = true;
  return question;
}

function nombreAuHasardEntre1Et10() {
  return Math.floor(Math.random() * 10) + 1;
}
