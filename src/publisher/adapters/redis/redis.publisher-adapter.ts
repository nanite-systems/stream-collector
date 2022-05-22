import { PublisherAdapterContract } from '../../concerns/publisher-adapter.contract';
import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { Stream } from 'ps2census';

@Injectable()
export class RedisPublisherAdapter implements PublisherAdapterContract {
  constructor(private readonly redis: IORedis) {}

  async publish(event: Stream.PS2Event): Promise<void> {
    await this.redis.publish('events', JSON.stringify(event));
  }
}
