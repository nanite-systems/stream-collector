import { Module } from '@nestjs/common';
import {
  CENSUS_SERVICE_ID,
  CENSUS_STREAM_URL,
  COLLECTOR_ID,
  PS2_ENVIRONMENT,
} from './census.constants';
import assert from 'assert';
import { randomUUID } from 'crypto';

@Module({
  providers: [
    {
      provide: PS2_ENVIRONMENT,
      useFactory: () => {
        assert(process.env.PS2_ENVIRONMENT, 'PS2_ENVIRONMENT env not set');
        assert(
          ['ps2', 'ps2ps4eu', 'ps2ps4us'].includes(process.env.PS2_ENVIRONMENT),
          'PS2_ENVIRONMENT env is not valid',
        );

        return process.env.PS2_ENVIRONMENT;
      },
    },
    {
      provide: CENSUS_SERVICE_ID,
      useFactory: () => {
        assert(process.env.CENSUS_TOKEN, 'CENSUS_TOKEN env not set');

        return process.env.CENSUS_SERVICE_ID;
      },
    },
    {
      provide: COLLECTOR_ID,
      useFactory: () => randomUUID(),
    },
    {
      provide: CENSUS_STREAM_URL,
      useFactory: (environment: string, serviceId: string) =>
        `wss://push.planetside2.com/streaming?environment=${environment}&service-id=s:${serviceId}`,
      inject: [PS2_ENVIRONMENT, CENSUS_SERVICE_ID],
    },
  ],
  exports: [CENSUS_STREAM_URL, PS2_ENVIRONMENT],
})
export class ConfigModule {}
