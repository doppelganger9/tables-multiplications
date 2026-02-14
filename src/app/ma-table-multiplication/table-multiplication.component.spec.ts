import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { StateService } from '../store/state.service';
import { TableMultiplicationComponent } from './table-multiplication.component';
import { TestBed } from '@angular/core/testing';

describe(`TableMultiplicationComponent`, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TableMultiplicationComponent],
      providers: [StateService],
      declarations: []
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TableMultiplicationComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it.each`
    nombre
    ${1}
    ${2}
    ${3}
    ${4}
    ${5}
    ${6}
    ${7}
    ${8}
    ${9}
    ${10}
  `('should show table for $nombre', ({ nombre }) => {
    const fixture = TestBed.createComponent(TableMultiplicationComponent);
    const app = fixture.componentInstance;

    app.nombre$ = of(nombre);

    app.ngOnChanges();

    app.tableMultiplication$.subscribe((res) => {
      expect(res).toMatchSnapshot();
    });
  });
});
