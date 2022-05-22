import { Stream } from 'ps2census';

export const PUBLISHER_ADAPTER = Symbol('token:publisher_adapter');

export interface PublisherAdapterContract {
  publish(event: Stream.PS2Event): Promise<void> | void;
}
