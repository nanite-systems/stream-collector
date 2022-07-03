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

    this.stream.on('debug', (message) => this.logger.verbose(message));
    this.stream.on('warn', (message) => this.logger.warn(message));
    this.stream.on('error', (err) => this.logger.error(err));

    ready.subscribe(() => {
      this.logger.log(`Connected to Census`);

      if (this.config.reconnectInterval) {
        this.logger.log(`Reconnect set: ${this.config.reconnectInterval}`);

        timer(this.config.reconnectInterval)
          .pipe(takeUntil(close))
          .subscribe(() => {
            this.logger.log('Force reconnect');
            this.stream.destroy();
          });
      }

      if (this.config.resubscribeInterval)
        this.logger.log(`Resubscribe set: ${this.config.resubscribeInterval}`);

      timer(0, this.config.resubscribeInterval)
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

    await this.stream.connect();
  }

  onApplicationShutdown(): void {
    this.reconnectSubscription.unsubscribe();
    this.stream.destroy();
  }

  private async subscribe(): Promise<void> {
    try {
      await this.stream.send({
        service: 'event',
        action: 'subscribe',
        characters: ['all'],
        worlds: this.config.worlds,
        eventNames: this.config.events,
        logicalAndCharactersWithWorlds: this.config.logicalAnd,
      });
    } catch (err) {
      this.logger.warn(`Failed to send subscription: ${err}`);
    }
  }
}
