import { MenuComponent } from './menu.component';

import { describe, beforeEach, it, expect } from 'vitest';
import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';

describe(`MenuComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [StateService],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
