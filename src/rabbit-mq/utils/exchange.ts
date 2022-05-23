import { ChannelWrapper } from 'amqp-connection-manager';

export class Exchange {
  constructor(
    private readonly name: string,
    private readonly channel: ChannelWrapper,
  ) {}

  async publish(message: any): Promise<void> {
    await this.channel.publish(this.name, '', JSON.stringify(message));
  }
}
