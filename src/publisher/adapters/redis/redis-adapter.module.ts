import { Module } from '@nestjs/common';
import { RedisModule } from '../../../redis/redis.module';
import { RedisPublisherAdapter } from './redis.publisher-adapter';
import { PUBLISHER_ADAPTER } from '../../concerns/publisher-adapter.contract';

@Module({
  imports: [RedisModule],
  providers: [
    RedisPublisherAdapter,
    {
      provide: PUBLISHER_ADAPTER,
      useClass: RedisPublisherAdapter,
    },
  ],
  exports: [PUBLISHER_ADAPTER],
})
export class RedisAdapterModule {}
