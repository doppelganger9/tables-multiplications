import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../store/state.service';
import { VersionData } from '../model';
import { CommonModule, DatePipe } from '@angular/common';
import { PushPipe } from "../push.pipe";

@Component({
    selector: 'app-footer',
    templateUrl: './mon-footer.component.html',
    styleUrls: ['./mon-footer.component.css'],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, DatePipe, PushPipe]
})
export class MonFooterComponent implements OnInit {
  version$: Observable<VersionData>;

  private readonly stateService: StateService = inject(StateService);

  ngOnInit(): void {
    this.version$ = this.stateService.getVersion();
  }
}
