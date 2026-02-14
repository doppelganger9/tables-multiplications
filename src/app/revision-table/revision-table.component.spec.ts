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
});
