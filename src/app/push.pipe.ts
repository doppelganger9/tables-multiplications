import {
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';

/**
 * The `push` pipe subscribes to an `Observable` and returns the latest value it has
 * emitted. When a new value is emitted, the `push` pipe runs local Change Detection on the
 * component.
 * When the component gets destroyed, the `push` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 *
 * inspirations from:
 * - https://github.com/rx-angular/rx-angular/blob/main/libs/template/push/src/lib/push.pipe.ts
 * - https://github.com/manfredsteyer/articles/blob/master/angular-elements-without-zonejs.md
 */
@Pipe({ name: 'push', pure: false })
export class PushPipe implements OnDestroy, PipeTransform {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;

  private _subscription: SubscriptionLike | null = null;
  private _obj: Observable<any> | EventEmitter<any> | null = null;

  constructor(private _ref: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  transform(obj: Observable<any> | null | undefined): any {
    if (!this._obj) {
      if (obj) {
        this._obj = obj;
        this._subscription = obj.subscribe({
          next: (value: Object) => this._updateLatestValue(obj, value)
        });
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj as any);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return this._latestValue;
  }

  private _dispose(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.detectChanges();
    }
  }
}
