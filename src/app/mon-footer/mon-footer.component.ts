import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { Observable as RxJsObservable } from 'rxjs';
import { StateService } from '../store/state.service';
import { VersionData } from '../model';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './mon-footer.component.html',
  styleUrls: ['./mon-footer.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DatePipe, AsyncPipe]
})
export class MonFooterComponent implements OnInit {
  version$: RxJsObservable<VersionData>;

  private readonly stateService: StateService = inject(StateService);

  ngOnInit(): void {
    this.version$ = this.stateService.getVersion();
  }
}
