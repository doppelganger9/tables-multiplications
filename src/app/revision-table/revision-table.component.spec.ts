import { RevisionTableComponent } from './revision-table.component';
import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';

describe(`RevisionTableComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StateService],
      declarations: [RevisionTableComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(RevisionTableComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
