import {
  Logger,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CENSUS_STREAM_URL } from './census.constants';
import { EventStream } from './census.stream';
import { CensusWsFactory } from './factories/census-ws.factory';
import * as assert from 'assert';
import { EventHandler } from './event.handler';
import { redisModule } from '../redis/redis.module';
import { EventPublisher } from './event.publisher';
import { WorldTracker } from './trackers/world.tracker';

@Module({
  imports: [redisModule],
  providers: [
    {
      provide: CENSUS_STREAM_URL,
      useFactory: () => {
        assert(process.env.PS2_ENVIRONMENT, 'PS2_ENVIRONMENT env not set');
        assert(process.env.CENSUS_TOKEN, 'CENSUS_TOKEN env not set');

        return `wss://push.planetside2.com/streaming?environment=${process.env.PS2_ENVIRONMENT}&service-id=s:${process.env.CENSUS_TOKEN}`;
      },
    },
    {
      provide: Logger,
      useFactory: () => new Logger('Census'),
    },
    EventStream,
    CensusWsFactory,
    EventHandler,
    EventPublisher,
    WorldTracker,
  ],
})
export class CensusModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(private readonly stream: EventStream) {}

  onApplicationBootstrap(): void {
    this.stream.start();
  }

  onApplicationShutdown(): void {
    this.stream.stop();
  }
}
