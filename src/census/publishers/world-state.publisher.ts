import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { WorldTracker } from '../trackers/world.tracker';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Unsubscribable } from 'rxjs';
import {
  PS2_ENVIRONMENT,
  WORLD_STATE_CHANNEL,
  WORLD_STATE_MAP,
} from '../census.constants';
import { WorldAccessor } from '../accessors/world.accessor';

@Injectable()
export class WorldStatePublisher implements OnModuleInit, OnModuleDestroy {
  private unsubscribe?: Unsubscribable;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly worldTracker: WorldTracker,
    private readonly worldAccessor: WorldAccessor,
    @Inject(PS2_ENVIRONMENT) private readonly ps2Environment: string,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.worldTracker.subscribe({
      next: ({ detail, state }) => {
        const worldId = this.worldAccessor.detailToId(detail);
        const worldState = JSON.stringify({
          worldId,
          environment: this.ps2Environment,
          detail,
          state,
        });

        void this.redis
          .pipeline()
          .publish(WORLD_STATE_CHANNEL, worldState)
          .hset(WORLD_STATE_MAP, worldId, worldState)
          .exec();
      },
    });
  }

  onModuleDestroy(): void {
    this.unsubscribe?.unsubscribe();
  }
}
