import { Module } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { RedisConfig } from './redis.config';
import IORedis from 'ioredis';

@Module({
  imports: [ConfigModule.forFeature([RedisConfig])],
  providers: [
    {
      provide: IORedis,
      useFactory: (config: RedisConfig) => new IORedis(config.url),
      inject: [RedisConfig],
    },
  ],
  exports: [IORedis],
})
export class RedisModule {}
