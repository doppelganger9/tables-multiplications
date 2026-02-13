import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '../push.pipe';
import { Observable, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-table-multiplication',
    templateUrl: './table-multiplication.component.html',
    styleUrls: ['./table-multiplication.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PushPipe]
})
export class TableMultiplicationComponent implements OnChanges {
  @Input()
  nombre$: Observable<number>;
  tableMultiplication$: Observable<Array<number>>;

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
