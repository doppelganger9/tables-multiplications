import { StateService } from '../store/state.service';
import { TableMultiplicationComponent } from './table-multiplication.component';
import { TestBed } from '@angular/core/testing';

describe(`TableMultiplicationComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StateService],
      declarations: [TableMultiplicationComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TableMultiplicationComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
