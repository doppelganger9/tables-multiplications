import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../store/state.service';
import { VersionData } from '../model';

@Component({
  selector: 'app-footer',
  templateUrl: './mon-footer.component.html',
  styleUrls: ['./mon-footer.component.css']
})
export class MonFooterComponent implements OnInit {
  version$: Observable<VersionData>;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.version$ = this.stateService.getVersion();
  }
}
