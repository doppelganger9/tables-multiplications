import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges
} from '@angular/core';

import { Observable as RxJsObservable, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-table-multiplication',
  templateUrl: './table-multiplication.component.html',
  styleUrls: ['./table-multiplication.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe]
})
export class TableMultiplicationComponent implements OnChanges {
  @Input()
  nombre$: RxJsObservable<number>;
  tableMultiplication$: RxJsObservable<Array<number>>;

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
