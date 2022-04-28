import { Module } from '@nestjs/common';
import { CensusStream } from './census.stream';
import { CensusWsFactory } from './factories/census-ws.factory';
import { redisModule } from '../redis/redis.module';
import { EventPublisher } from './publishers/event.publisher';
import { ConfigModule } from './config.module';
import { WorldStatePublisher } from './publishers/world-state.publisher';
import { WorldAccessor } from './accessors/world.accessor';

@Module({
  imports: [redisModule, ConfigModule],
  providers: [
    CensusStream,
    CensusWsFactory,
    EventPublisher,
    WorldStatePublisher,
    WorldAccessor,
  ],
})
export class CensusModule {}
