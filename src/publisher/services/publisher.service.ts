import { Inject, Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { EVENT_EXCHANGE } from '../../rabbit-mq/constants';
import { Exchange } from '../../rabbit-mq/utils/exchange';

@Injectable()
export class PublisherService {
  constructor(@Inject(EVENT_EXCHANGE) private readonly exchange: Exchange) {}

  async publish(payload: Stream.PS2Event): Promise<void> {
    const { event_name: eventName, world_id: worldId } = payload;

    await this.exchange.publish({
      eventName,
      worldId,
      collector: 'quack',
      payload,
    });
  }
}
