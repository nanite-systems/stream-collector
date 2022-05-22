import { Module } from '@nestjs/common';
import { PublisherService } from './services/publisher.service';
import { CensusModule } from '../census/census.module';
import { RedisAdapterModule } from './adapters/redis/redis-adapter.module';

@Module({
  imports: [CensusModule, RedisAdapterModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
