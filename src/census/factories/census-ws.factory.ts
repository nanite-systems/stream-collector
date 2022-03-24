import { Inject, Injectable } from '@nestjs/common';
import { CENSUS_STREAM_URL } from '../census.constants';
import { WebSocket } from 'ws';

@Injectable()
export class CensusWsFactory {
  constructor(@Inject(CENSUS_STREAM_URL) private readonly url: string) {}

  make(): WebSocket {
    return new WebSocket(this.url);
  }
}
