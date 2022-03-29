import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { PS2Event } from '../concerns/event.types';
import { PS2_ENVIRONMENT } from '../census.constants';

@Injectable()
export class EventPublisher {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(PS2_ENVIRONMENT) private readonly ps2Environment: string,
  ) {}

  publish(payload: PS2Event): void {
    const { world_id, event_name } = payload;

    void this.redis.publish(
      `events:${this.ps2Environment}:${event_name}`,
      JSON.stringify({
        worldId: world_id,
        eventName: event_name,
        environment: this.ps2Environment,
        payload,
      }),
    );
  }
}
