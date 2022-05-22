import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Stream } from 'ps2census';
import { CensusConfig } from '../census.config';
import { fromEvent, Subscription, takeUntil, timer } from 'rxjs';

@Injectable()
export class StreamManagerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  static readonly SUBSCRIPTION_INTERVAL = 5 * 3600 * 1000;

  private readonly logger = new Logger('StreamManagerService');

  private reconnectSubscription?: Subscription;

  constructor(
    private readonly stream: Stream.Client,
    private readonly config: CensusConfig,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const ready = fromEvent(this.stream, 'ready');
    const close = fromEvent(this.stream, 'close');

    this.logger.log(`Connecting to Census`);

    ready.subscribe(() => {
      this.logger.log(`Connected to Census`);

      // Subscribe
      timer(0, StreamManagerService.SUBSCRIPTION_INTERVAL)
        .pipe(takeUntil(close))
        .subscribe(() => {
          void this.subscribe();
        });
    });

    this.reconnectSubscription = close.subscribe(() => {
      this.logger.log(`Reconnecting to Census`);

      // TODO: Add some delay between reconnects
      void this.stream.connect();
    });

    try {
      await this.stream.connect();
    } catch (err) {}
  }

  onApplicationShutdown(): void {
    this.reconnectSubscription.unsubscribe();
    this.stream.destroy();
  }

  private async subscribe(): Promise<void> {
    await this.stream.send({
      service: 'event',
      action: 'subscribe',
      characters: ['all'],
      worlds: this.config.worlds,
      eventNames: this.config.events,
      logicalAndCharactersWithWorlds: this.config.logicalAnd,
    });
  }
}
