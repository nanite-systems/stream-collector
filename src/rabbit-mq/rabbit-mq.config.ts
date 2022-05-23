import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty } from 'class-validator';

export class RabbitMqConfig {
  @ProcessEnv('RMQ_URL')
  @IsNotEmpty()
  url = 'amqp://localhost';

  @ProcessEnv('RMQ_EVENT_EXCHANGE')
  @IsNotEmpty()
  eventExchange: string;
}
