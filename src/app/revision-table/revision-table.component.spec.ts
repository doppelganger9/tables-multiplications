import { RevisionTableComponent } from './revision-table.component';

import { beforeEach, describe, expect, it } from 'vitest';
import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';

describe(`RevisionTableComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RevisionTableComponent],
      providers: [StateService]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(RevisionTableComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it.each([
    [true, 'Bravo'],
    [false, 'Dommage, essaye encore !']
  ])('should speak the answer result', (correcte, texte) => {
    const fixture = TestBed.createComponent(RevisionTableComponent);
    const app = fixture.componentInstance;
    const utterances: SpeechSynthesisUtterance[] = [];
    const speechSynthesis = {
      cancel: () => undefined,
      speak: (utterance: SpeechSynthesisUtterance) => {
        utterances.push(utterance);
      }
    } as unknown as SpeechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speechSynthesis
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        lang = '';
        text: string;
        onend: (() => void) | null = null;

        constructor(text: string) {
          this.text = text;
        }
      }
    });

    (app as any).prononcerReponse(4, 5, correcte);

    expect(utterances).toHaveLength(1);
    expect(utterances[0].text).toBe(texte);
    expect(utterances[0].lang).toBe('fr-FR');
  });

  it('should speak the new question', () => {
    const fixture = TestBed.createComponent(RevisionTableComponent);
    const app = fixture.componentInstance;
    const utterances: SpeechSynthesisUtterance[] = [];
    const speechSynthesis = {
      cancel: () => undefined,
      speak: (utterance: SpeechSynthesisUtterance) => {
        utterances.push(utterance);
      }
    } as unknown as SpeechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speechSynthesis
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        lang = '';
        text: string;

        constructor(text: string) {
          this.text = text;
        }
      }
    });

    (app as any).prononcerQuestion(4, 5);

    expect(utterances).toHaveLength(1);
    expect(utterances[0].text).toBe('4 x 5');
  });

  it('should repeat the question after an incorrect answer', () => {
    const fixture = TestBed.createComponent(RevisionTableComponent);
    const app = fixture.componentInstance;
    const utterances: SpeechSynthesisUtterance[] = [];
    const speechSynthesis = {
      cancel: () => undefined,
      speak: (utterance: SpeechSynthesisUtterance) => {
        utterances.push(utterance);
      }
    } as unknown as SpeechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speechSynthesis
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        lang = '';
        text: string;
        onend: (() => void) | null = null;

        constructor(text: string) {
          this.text = text;
        }
      }
    });

    (app as any).prononcerReponse(4, 5, false, () => {
      (app as any).prononcerQuestion(4, 5);
    });
    utterances[0].onend?.({} as SpeechSynthesisEvent);

    expect(utterances).toHaveLength(2);
    expect(utterances[1].text).toBe('4 x 5');
  });
});
