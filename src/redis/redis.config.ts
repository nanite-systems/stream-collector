import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsUrl } from 'class-validator';

export class RedisConfig {
  @ProcessEnv('REDIS_URL')
  @IsUrl({ protocols: ['redis'] })
  url = 'redis://127.0.0.1:6379';
}
