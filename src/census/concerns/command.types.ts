import { PS2EventNames } from './event.types';

export type Echo = {
  service: 'event';
  action: 'echo';
  payload: unknown;
};

export type Subscribe = {
  service: 'event';
  action: 'subscribe';
  characters?: string[];
  eventNames?: ('all' | PS2EventNames)[];
  worlds?: string[];
  logicalAndCharacters?: boolean;
};

export type ClearSubscribe = {
  service: 'event';
  action: 'clearSubscribe';
  all?: boolean;
  characters?: string[];
  eventNames?: ('all' | PS2EventNames)[];
  worlds?: string[];
};

export type RecentCharacters = {
  service: 'event';
  action: 'recentCharacterIds';
};

export type RecentCharactersCount = {
  service: 'event';
  action: 'recentCharacterIdsCount';
};

export type CensusCommand =
  | Echo
  | Subscribe
  | ClearSubscribe
  | RecentCharacters
  | RecentCharactersCount;
