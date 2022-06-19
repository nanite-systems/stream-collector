import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty } from 'class-validator';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  @IsNotEmpty()
  url = 'amqp://localhost';

  @ProcessEnv('RABBITMQ_EVENT_EXCHANGE')
  @IsNotEmpty()
  eventExchange: string;
}
