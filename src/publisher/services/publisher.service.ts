import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  PUBLISHER_ADAPTER,
  PublisherAdapterContract,
} from '../concerns/publisher-adapter.contract';
import { filter, fromEvent, map, Subscription } from 'rxjs';
import { Stream } from 'ps2census';

@Injectable()
export class PublisherService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private eventSubscription?: Subscription;

  constructor(
    @Inject(PUBLISHER_ADAPTER)
    private readonly adapter: PublisherAdapterContract,
    private readonly steam: Stream.Client,
  ) {}

  onApplicationBootstrap(): void {
    this.eventSubscription = fromEvent(this.steam, 'message')
      .pipe(
        filter<Stream.CensusMessage>(
          (message) =>
            message.service == 'event' &&
            message.type == 'serviceMessage' &&
            'event_name' in message.payload,
        ),
        map<Stream.CensusMessage, Stream.PS2Event>(
          (message) => message.payload,
        ),
      )
      .subscribe((event) => {
        this.adapter.publish(event);
      });
  }

  onApplicationShutdown(): void {
    this.eventSubscription.unsubscribe();
  }
}
