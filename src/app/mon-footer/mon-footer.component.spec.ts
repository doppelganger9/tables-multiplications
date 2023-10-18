import { MonFooterComponent } from './mon-footer.component';

import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VersionData } from '../model';

describe(`MonFooterComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: StateService,
          useValue: {
            getVersion: () =>
              of({
                version: 'test',
                shortSHA: 'fake',
                lastCommitTime: new Date(
                  Date.parse('2023-10-18T20:52:16.000+0200')
                )
              } as VersionData)
          } as Partial<StateService>
        }
      ],
      declarations: [MonFooterComponent]
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
