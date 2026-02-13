import 'zone.js';
import 'zone.js/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';

Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

// to avoid too much verbose errors from Zone.js
Error.stackTraceLimit = 2;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true }
  }
);

registerLocaleData(localeFr, 'fr-FR');

beforeEach(() => {
  getTestBed().configureTestingModule({
    providers: [
      {
        provide: LOCALE_ID,
        useValue: 'fr-FR'
      }
    ]
  });
});
