import { StateService } from './state.service';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe(`StateService`, () => {
  beforeEach(async () => {
    const stockage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (cle: string) => stockage.get(cle) ?? null,
      setItem: (cle: string, valeur: string) => stockage.set(cle, valeur),
      removeItem: (cle: string) => stockage.delete(cle)
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [StateService],
      declarations: []
    }).compileComponents();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('service should exist', () => {
    const service = TestBed.inject(StateService);
    expect(service).toBeTruthy();
  });

  it('does not repeat the previous operand immediately', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const service = new StateService();

    const premiereQuestion = await firstValueFrom(
      service.generateNewQuestion()
    );
    const deuxiemeQuestion = await firstValueFrom(
      service.generateNewQuestion()
    );

    expect(premiereQuestion.operande).toBe(1);
    expect(deuxiemeQuestion.operande).toBe(2);
  });

  it('persists answers and can reset them', async () => {
    const service = new StateService();
    const question = await firstValueFrom(service.generateNewQuestion());

    await firstValueFrom(service.soumettreReponse(question.total ?? 0));
    const recreatedService = new StateService();

    expect(await firstValueFrom(recreatedService.getReponses())).toHaveLength(
      1
    );

    await firstValueFrom(recreatedService.reinitialiserStatistiques());
    expect(await firstValueFrom(recreatedService.getReponses())).toEqual([]);
  });

  it('returns empty statistics for tables without answers', async () => {
    const service = new StateService();

    const statistiques = await firstValueFrom(
      service.getStatistiquesReponsesGlobales()
    );

    expect(statistiques).toHaveLength(10);
    expect(
      statistiques.every((statistique) => statistique.reponses.length === 0)
    ).toBe(true);
  });

  it('calculates correct, incorrect and standard deviation statistics', async () => {
    localStorage.setItem(
      'tables-multiplications.reponses.v1',
      JSON.stringify([
        {
          nombre: 6,
          operande: 2,
          reponse: 12,
          correcte: true,
          tempsMillisecondes: 100
        },
        {
          nombre: 6,
          operande: 3,
          reponse: 10,
          correcte: false,
          tempsMillisecondes: 300
        }
      ])
    );
    const service = new StateService();

    const statistique = (
      await firstValueFrom(service.getStatistiquesReponsesGlobales())
    )[5];

    expect(statistique.reponsesCorrectesSurLEnsemble).toBe(1);
    expect(statistique.reponsesIncorrectesSurLEnsemble).toBe(1);
    expect(statistique.moy).toBe(200);
    expect(statistique.ecartType).toBe(100);
  });

  it('prioritizes an operation with errors over mastered operations', async () => {
    const reponses = [
      {
        nombre: 1,
        operande: 1,
        reponse: 0,
        correcte: false,
        tempsMillisecondes: 4000,
        prochaineRevision: 0
      },
      ...Array.from({ length: 9 }, (_, index) => ({
        nombre: 1,
        operande: index + 2,
        reponse: index + 2,
        correcte: true,
        tempsMillisecondes: 500,
        repetitions: 3,
        prochaineRevision: Date.now() + 86400000
      }))
    ];
    localStorage.setItem(
      'tables-multiplications.reponses.v1',
      JSON.stringify(reponses)
    );
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const service = new StateService();

    const question = await firstValueFrom(service.generateNewQuestion());

    expect(question.operande).toBe(1);
  });
});
