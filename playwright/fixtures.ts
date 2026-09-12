import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ speechSynthesis: void }>({
  speechSynthesis: [
    async ({ page }, use) => {
      await page.addInitScript(() => {
        class MockSpeechSynthesisUtterance {
          lang = '';
          onend: (() => void) | null = null;

          constructor(public text: string) {}
        }

        Object.defineProperty(window, 'SpeechSynthesisUtterance', {
          configurable: true,
          value: MockSpeechSynthesisUtterance
        });
        Object.defineProperty(window, 'speechSynthesis', {
          configurable: true,
          value: {
            cancel: () => undefined,
            speak: (utterance: MockSpeechSynthesisUtterance) => {
              queueMicrotask(() => utterance.onend?.());
            }
          }
        });
      });

      await use();
    },
    { auto: true }
  ]
});

export { expect };
