import { Injectable, Logger } from '@nestjs/common';
import { EventPublisher } from './event.publisher';
import { PS2Event } from './concerns/event.types';

@Injectable()
export class EventHandler {
  private eventCounter = 0;

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly logger: Logger,
  ) {
    setInterval(() => {
      logger.log(`Received ${this.eventCounter} events in the last minute`);
      this.eventCounter = 0;
    }, 60 * 1000).unref();
  }

  handle(event: PS2Event): void {
    this.eventCounter++;
    // Duplication filter
    // Hydrate team_id, world_id

    this.eventPublisher.publish(event);
  }
}
