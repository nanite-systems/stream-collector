import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { WebSocket } from 'ws';
import { CensusWsFactory } from './factories/census-ws.factory';
import { CensusMessage } from './concerns/message.types';
import { CensusCommand } from './concerns/command.types';
import { EventPublisher } from './publishers/event.publisher';
import { WorldStatePublisher } from './publishers/world-state.publisher';

@Injectable()
export class CensusStream
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  static readonly HEARTBEAT_INTERVAL = 30 * 1000;

  static readonly MIN_RECONNECT_TIMEOUT = 1000;

  static readonly CONNECTION_TIMEOUT = 4 * 1000;

  static readonly SUBSCRIPTION_INTERVAL = 5 * 3600 * 1000;

  private readonly logger = new Logger('CensusStream');

  private isStarted = false;

  private lastConnectionTime = 0;

  private reconnectTimeout?: NodeJS.Timeout = null;

  private connectionTimeout?: NodeJS.Timeout = null;

  private heartbeatAcknowledged = false;

  private heartbeatInterval?: NodeJS.Timeout = null;

  private subscriptionInterval?: NodeJS.Timeout = null;

  private census: WebSocket;

  constructor(
    private readonly censusWsFactory: CensusWsFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly worldStatePublisher: WorldStatePublisher,
  ) {}

  onApplicationBootstrap(): void {
    if (this.isStarted) return;
    this.isStarted = true;

    this.connect();
  }

  onApplicationShutdown(): void {
    if (!this.isStarted) return;
    this.isStarted = false;

    this.cleanUpConnection();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  sendCommand(command: CensusCommand): void {
    this.census.send(JSON.stringify(command));
  }

  private connect(): void {
    this.census = this.censusWsFactory.make();

    this.lastConnectionTime = Date.now();

    this.setConnectionTimeout();

    this.census.once('open', () => {
      this.logger.log('Connected to Census');
    });

    this.census.once('close', (code, reason) => {
      this.logger.log(
        `Connection to Census closed with code ${code}: ${reason ?? '-'}`,
      );

      this.reconnect();
    });

    this.census.on('error', (err) => {
      this.logger.warn(`An error occurred on the stream: ${err.message}`);
    });

    this.census.once('error', () => {
      this.reconnect();
    });

    this.census.on('message', (data: Buffer) => {
      try {
        const payload: CensusMessage = JSON.parse(data.toString());

        this.handle(payload);
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.logger.warn(`Received malformed package`, data.toString());
        } else {
          throw e;
        }
      }
    });
  }

  private cleanUpConnection(): void {
    this.census?.removeAllListeners();

    this.clearConnectionTimeout();
    this.clearHeartbeat();
    this.clearSubscription();

    try {
      this.census?.close();
    } catch (e) {
      // Ignore
    }
  }

  private reconnect(): void {
    if (!this.isStarted) return;

    this.logger.log(
      `Reconnecting to Census(previous ${this.lastConnectionTime})`,
    );

    this.cleanUpConnection();

    const diff = Date.now() - this.lastConnectionTime;

    if (diff > CensusStream.MIN_RECONNECT_TIMEOUT) {
      this.connect();
    } else {
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
        this.reconnectTimeout = null;
      }, CensusStream.MIN_RECONNECT_TIMEOUT);
    }
  }

  private setConnectionTimeout(): void {
    this.connectionTimeout = setTimeout(() => {
      this.logger.warn('Connection timed-out, reconnecting');

      this.reconnect();
    }, CensusStream.CONNECTION_TIMEOUT);
  }

  private clearConnectionTimeout(): void {
    clearTimeout(this.connectionTimeout);
    this.connectionTimeout = null;
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.heartbeatAcknowledged) {
        this.heartbeatAcknowledged = false;
      } else {
        this.logger.warn('Missed a heartbeat, reconnecting');
        this.reconnect();
      }
    }, CensusStream.HEARTBEAT_INTERVAL).unref();
  }

  private clearHeartbeat() {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  private acknowledgeHeartbeat() {
    this.heartbeatAcknowledged = true;
  }

  private subscribe(): void {
    this.sendCommand({
      service: 'event',
      action: 'subscribe',
      characters: ['all'],
      worlds: ['all'],
      eventNames: ['all'],
    });
  }

  private setSubscription(): void {
    this.subscribe();

    this.subscriptionInterval = setInterval(() => {
      this.subscribe();
    }, CensusStream.SUBSCRIPTION_INTERVAL);
  }

  private clearSubscription(): void {
    clearInterval(this.subscriptionInterval);
    this.subscriptionInterval = null;
  }

  private handle(message: CensusMessage): void {
    if ('service' in message) {
      switch (message.service) {
        case 'push':
          this.handlePushService(message);
          break;
        case 'event':
          this.handleEventService(message);
          break;
        default:
          this.logger.warn(`Received an unknown service message`, message);
      }
    } else if ('subscription' in message) {
      this.logger.log('Subscription confirmed', message.subscription);
    } else if ('send this for help' in message) {
      // Ignore this
    } else {
      this.logger.warn('Received unknown payload', message);
    }
  }

  private handlePushService(
    message: Extract<CensusMessage, { service: 'push' }>,
  ) {
    switch (message.type) {
      case 'connectionStateChanged':
        if (message.connected) {
          this.logger.log('Connection state: connected');

          this.clearConnectionTimeout();
          this.startHeartbeat();
          this.setSubscription();
        } else {
          this.logger.warn('Connection state: disconnected');

          this.reconnect();
        }
        break;
      default:
        this.logger.warn(`Unknown push service ${message.type}`, message);
    }
  }

  private handleEventService(
    message: Extract<CensusMessage, { service: 'event' }>,
  ) {
    switch (message.type) {
      case 'heartbeat':
        // Heartbeat contains online state of servers
        this.logger.verbose('Heartbeat', message.online);

        this.acknowledgeHeartbeat();

        break;
      case 'serviceStateChanged':
        // Gives the state of the different servers
        this.logger.log(
          `Service state changed for "${message.detail}: ${message.online}"`,
        );

        this.worldStatePublisher.publish(message);

        break;
      case 'serviceMessage':
        // Payload contains a game event
        this.eventPublisher.publish(message.payload);

        break;
      default:
        this.logger.warn(`Unknown event service type`, message);
    }
  }
}
