import { Injectable } from '@nestjs/common';
import { Observer, Subject, Subscribable, Unsubscribable } from 'rxjs';

export interface WorldStateUpdate {
  detail: string;
  state: boolean;
}

@Injectable()
export class WorldTracker implements Subscribable<WorldStateUpdate> {
  private readonly worlds = new Map<string, boolean>();

  readonly observable = new Subject<WorldStateUpdate>();

  getWorldStates() {
    return this.worlds.entries();
  }

  setWorldState(detail: string, state: boolean): void {
    this.worlds.set(detail, state);
    this.observable.next({
      detail,
      state,
    });
  }

  subscribe(observer: Partial<Observer<WorldStateUpdate>>): Unsubscribable {
    return this.observable.subscribe(observer);
  }
}
