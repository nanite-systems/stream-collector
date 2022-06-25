import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty } from 'class-validator';

export class PublisherConfig {
  @ProcessEnv('PUBLISHER_ID')
  @IsNotEmpty()
  publisherId: string;
}
