import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { PS2_ENVIRONMENT, WORLD_STATE_CHANNEL } from '../census.constants';
import { WorldAccessor } from '../accessors/world.accessor';
import { ServiceStateChanged } from '../concerns/message.types';

@Injectable()
export class WorldStatePublisher {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly worldAccessor: WorldAccessor,
    @Inject(PS2_ENVIRONMENT) private readonly ps2Environment: string,
  ) {}

  publish({ detail, online }: ServiceStateChanged): void {
    void this.redis.publish(
      WORLD_STATE_CHANNEL,
      JSON.stringify({
        worldId: this.worldAccessor.detailToId(detail),
        detail,
        state: JSON.stringify(online),
      }),
    );
  }
}
