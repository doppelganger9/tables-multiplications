import { MonFooterComponent } from './mon-footer.component';

import { describe, beforeEach, it, expect } from 'vitest';
import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VersionData } from '../model';

describe(`MonFooterComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MonFooterComponent],
      providers: [
        {
          provide: StateService,
          useValue: {
            getVersion: () =>
              of({
                version: 'test',
                shortSHA: 'fake',
                lastCommitTime: new Date(
                  // NOTE: le test s'éxécute en TZ=UTC
                  Date.parse('2023-10-18T20:52:16.000+0200')
                )
              } as VersionData)
          } as Partial<StateService>
        }
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MonFooterComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the version from stateService', () => {
    const fixture = TestBed.createComponent(MonFooterComponent);

    fixture.detectChanges();

    expect(
      (fixture.debugElement.nativeElement as HTMLElement).querySelector(
        `[data-e2e="version-container"]`
      )
    ).toMatchSnapshot();
  });
});
