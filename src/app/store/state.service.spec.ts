import { StateService } from './state.service';
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
