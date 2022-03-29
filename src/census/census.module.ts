import { Module } from '@nestjs/common';
import { EventStream } from './census.stream';
import { CensusWsFactory } from './factories/census-ws.factory';
import { EventHandler } from './event.handler';
import { redisModule } from '../redis/redis.module';
import { EventPublisher } from './publishers/event.publisher';
import { WorldTracker } from './trackers/world.tracker';
import { ConfigModule } from './config.module';
import { WorldStatePublisher } from './publishers/world-state.publisher';
import { WorldAccessor } from './accessors/world.accessor';

@Module({
  imports: [redisModule, ConfigModule],
  providers: [
    EventStream,
    CensusWsFactory,
    EventHandler,
    EventPublisher,
    WorldTracker,
    WorldStatePublisher,
    WorldAccessor,
  ],
})
export class CensusModule {}
