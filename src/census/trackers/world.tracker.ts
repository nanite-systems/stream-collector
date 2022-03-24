import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class WorldTracker {
  private readonly worlds = new Map<string, boolean>();

  constructor(@InjectRedis() private readonly redis: Redis) {}

  getWorldState(world: string): boolean {
    return this.worlds.get(world) ?? false;
  }

  getWorldStates() {
    return this.worlds.entries();
  }

  setWorldState(world: string, state: boolean): void {
    if (this.worlds.get(world) === state) return;

    this.worlds.set(world, state);

    this.redis
      .pipeline()
      .hset('world_states', world, state)
      .publish('world_updates', world)
      .exec();
  }
}
