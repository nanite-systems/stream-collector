import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  PUBLISHER_ADAPTER,
  PublisherAdapterContract,
} from '../concerns/publisher-adapter.contract';
import { Stream } from 'ps2census';

@Injectable()
export class PublisherService implements OnApplicationBootstrap {
  constructor(
    @Inject(PUBLISHER_ADAPTER)
    private readonly adapter: PublisherAdapterContract,
    private readonly steam: Stream.Client,
  ) {}

  onApplicationBootstrap(): void {
    this.steam.on('message', (message) => {
      if (
        message.service == 'event' &&
        message.type == 'serviceMessage' &&
        'event_name' in message.payload
      ) {
        this.adapter.publish(message.payload);
      }
    });
  }
}
