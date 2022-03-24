import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { PS2Event } from './concerns/event.types';

@Injectable()
export class EventPublisher {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject() private readonly ps2Environment: string,
  ) {}

  publish(payload: PS2Event): void {
    const { world_id, event_name } = payload;

    this.redis.publish(
      `census-events`,
      JSON.stringify({
        world_id,
        event_name,
        environment: this.ps2Environment,
        event,
      }),
    );
  }
}
