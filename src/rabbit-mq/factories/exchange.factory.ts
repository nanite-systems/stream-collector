import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '../constants';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Exchange } from '../utils/exchange';

@Injectable()
export class ExchangeFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string): Exchange {
    return new Exchange(name, this.setupChannel(name));
  }

  private setupChannel(name: string): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
      setup: (channel) => {
        return channel.assertExchange(name, 'fanout', {
          durable: false,
        });
      },
    });
  }
}
