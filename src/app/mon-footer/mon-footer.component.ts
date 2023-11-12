import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../store/state.service';
import { VersionData } from '../model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './mon-footer.component.html',
  styleUrls: ['./mon-footer.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonFooterComponent implements OnInit {
  version$: Observable<VersionData>;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.version$ = this.stateService.getVersion();
  }
}
