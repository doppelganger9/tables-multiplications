import { StateService } from './state.service';

import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

describe(`StateService`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StateService],
      declarations: []
    }).compileComponents();
  });

  it('service should exist', () => {
    const service = TestBed.inject(StateService);
    expect(service).toBeTruthy();
  });
});
