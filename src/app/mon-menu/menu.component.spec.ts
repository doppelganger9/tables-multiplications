import { MenuComponent } from './menu.component';
import { StateService } from '../store/state.service';
import { TestBed } from '@angular/core/testing';

describe(`MenuComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StateService],
      declarations: [MenuComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
