import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty } from 'class-validator';
import { randomUUID } from 'crypto';

export class PublisherConfig {
  @ProcessEnv('PUBLISHER_ID')
  @IsNotEmpty()
  publisherId = randomUUID();
}
