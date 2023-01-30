import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'ma-table-multiplication',
  templateUrl: './ma-table-multiplication.component.html',
  styleUrls: ['./ma-table-multiplication.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaTableMultiplicationComponent implements OnInit, OnChanges {
  @Input()
  nombre$: Observable<number>;
  tableMultiplication$: Observable<Array<number>>;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.tableMultiplication$ = this.nombre$.pipe(
      switchMap((nombre) => of(calculerTable(nombre)))
    );
  }
}

function calculerTable(nombre: number): Array<number> {
  const res = [];
  for (let i = 1; i <= 10; i++) {
    res.push(nombre * i);
  }
  return res;
}
